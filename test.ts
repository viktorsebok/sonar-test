import { AssetId, TimeSeriesData } from "@ametek-dunker-iiot/edge-lib-oi4service";
import { MindConnectAgent, TimeStampedDataPoint } from "@mindconnect/mindconnect-nodejs";
import { CloudAsset } from "../CloudAssetProvider/CloudAsset";
import { CloudAssetProvider } from "../CloudAssetProvider/CloudAssetProvider";
import { CloudMappingService } from "../CloudMappingService/CloudMappingService";
import { DeviceTimeSeries } from "./DeviceTimeSeries";
var logger = require("@ametek-dunker-iiot/edge-lib-logger");


const DEFAULT_BULK_TIME = 30*60*1000;
const DATA_SEND_RETRY_TIME = 5*60*1000;

export class CloudBulkDataService{
    
    private currentList: DeviceTimeSeries[] = [];
    private unsentLists: DeviceTimeSeries[][] = [];
    private missingCloudAssets: AssetId[] = [];
    private validCloudAssets: CloudAsset[] = [];
    private postInterval: number = DEFAULT_BULK_TIME;
    //#region C'tor
    constructor(private agent: MindConnectAgent, private cloudAssetProvider: CloudAssetProvider, private mappingService: CloudMappingService){
        const bulkInterval = Number(process.env.CLOUD_BULK_INTERVAL_SEC);
        if(!isNaN(bulkInterval)){
            this.postInterval = bulkInterval * 1000;
        }

        logger.info(`Bulk time interval is ${this.postInterval / 1000} sec.`);
        this.scheduleNexPost();
    }
    //#endregion

    //#region Public 

    public commitPoint(point: TimeSeriesData, device: AssetId, date: Date){
        logger.debug(`TimeSeries point registration to the buffer, entry`);
        
        if (point && device){
            this.currentList.push(new DeviceTimeSeries(device, point, date));
            logger.info(`${point.Parameter} point committed.`, 60*1000);
        }
        else{
            logger.error(`TimeSeries point registration failed, the point instance is invalid!`);
        }

        logger.debug(`TimeSeries point registration to the buffer, exit`);
    }

    //#endregion

    //#region private

    private scheduleNexPost(altTimeout = Infinity){
        let postTime = this.postInterval;
        if (altTimeout<postTime){
            postTime = altTimeout;
        }
        setTimeout(async ()=>{
            await this.post();
        }, postTime);
    }

    private getTimeStampedData(ts: DeviceTimeSeries): TimeStampedDataPoint|null{
        let result: TimeStampedDataPoint|null = null;
        const cloudDevice = this.cloudAssetProvider.assets.find(x=>x.egdeAssetId?.equals(ts.device));
        if (cloudDevice && ts?.ts){
            const id = cloudDevice.getParamId(ts.ts.Parameter);
            if (id){
                result = {timestamp: ts.time.toISOString(), values: [{dataPointId:id, qualityCode:"100", value:ts.ts.Value.toString()}]};
            }
            else{
                logger.warn(`No mapping ID for ${ts.ts.Parameter} in the device ${cloudDevice.egdeAssetId?.value}`, 60*1000);
            }
        }
        else{
            logger.error(`Can't create TimeStampedDataPoint based on invalid data ( ${cloudDevice} - ${ts?.ts})!`);
        }
        return result;
    }

    private async post():Promise<void>{
        logger.debug(`Post bulk data entry`);

        let success = false; 

        if (this.currentList.length>0){
            this.unsentLists.push(this.currentList);
            this.currentList = [];
        }

        if (this.unsentLists.length>0){
            
            if (this.agent.IsOnBoarded()){

                success = await this.updateTimeSeriesAssets();
                success = success && this.removeMissingAssets();
                success = success && await this.mappingService.mapDevices(this.validCloudAssets);
                success = success && await this.removeInvalidPoints();

                while (this.unsentLists.length>0 && success){
                    logger.info(`Posting data ${this.unsentLists[0][0]?.time} - ${this.unsentLists[0][this.unsentLists[0].length-1]?.time},
                            number of points: ${this.unsentLists[0].length}`);

                    const timeStampedData: TimeStampedDataPoint[] = [];
                    this.unsentLists[0].forEach(x=>{
                        const ts = this.getTimeStampedData(x);
                        if (ts){
                            timeStampedData.push(ts);
                        }
                    });

                    try
                    {
                        success =  await this.agent.BulkPostData(timeStampedData);
                    } catch(error){
                        success = false;
                        logger.warn(`TimeSeries post error: ${error}`);
                    }

                    if (success){
                        this.unsentLists.shift();
                        logger.info(`Post succeeded... :)`);
                    }
                }
            }
            else{
                logger.warn(`TimeSeries POST not started, the agent is not onboared!`);
            }
        }
        else{
            logger.info(`No TimeSeries data to send...`);
            success = true;
        }


        if (!success) {
            logger.warn(`Failed to send TimeSeries data, retry in ${DATA_SEND_RETRY_TIME>this.postInterval?this.postInterval:DATA_SEND_RETRY_TIME} ms`);
            this.scheduleNexPost(DATA_SEND_RETRY_TIME);
        }
        else{
            this.scheduleNexPost();
        }
        
        logger.debug(`Post bulk data exit: ${success}`);
    }


    private removeMissingAssets(): boolean{
        let success = true;
        for (const idxBlock in this.unsentLists){
            for(let idxTs = this.unsentLists[idxBlock].length -1; idxTs>=0; idxTs--){
                if (this.missingCloudAssets.some(x=>x.equals(this.unsentLists[idxBlock][idxTs].device))){
                    success = this.removePoint(+idxBlock,+idxTs,"no cloud definition") && success;
                }
            }
        }
        return success;
    }

    private async updateTimeSeriesAssets():Promise<boolean>{
        this.missingCloudAssets = [];
        this.validCloudAssets = [];
        let success = await this.cloudAssetProvider.sync(); // MS should inform the agent, that the assets are changed

        for (const tsBlock of this.unsentLists){
            for(const ts of tsBlock){
                if (!this.cloudAssetProvider.assets.some(x=>x.egdeAssetId?.equals(ts.device)) && !this.missingCloudAssets.some(x=>x.equals(ts.device))){
                    this.missingCloudAssets.push(ts.device);
                    logger.warn(`Missing cloud device for timeseries point: ${ts.device.value}`);
                }
                else if (!this.validCloudAssets.some(x=>x.egdeAssetId?.equals(ts.device)) && this.cloudAssetProvider.assets.some(x=>x.egdeAssetId?.equals(ts.device)) ){
                    const validAsset = this.cloudAssetProvider.assets.find(x=>x.egdeAssetId?.equals(ts.device));
                    if (validAsset){
                        this.validCloudAssets.push(validAsset);
                    }
                    else{
                        logger.warn(`Valid asset is not available in the cloud: ${ts.device.value}`);
                    }
                }
            }
        }

        return success;
    }

    private async removeInvalidPoints(): Promise<boolean>{
        let success = true;
        
        for (const idxBlock in this.unsentLists){
            for(let idxTs = this.unsentLists[idxBlock].length -1; idxTs>=0; idxTs--){
                const point = this.unsentLists[idxBlock][idxTs];
                const cloudAsset = this.validCloudAssets.find(x=>x.egdeAssetId?.equals(point.device));
                if(cloudAsset){
                    const param = cloudAsset.getVariable(point.ts.Parameter);
                    if (param){
                        const checkTsResult = point.isValid(param);
                        if(!checkTsResult.valid){
                            success = this.removePoint(+idxBlock,+idxTs,checkTsResult.issue) && success;
                        }
                    }
                    else{
                        success = this.removePoint(+idxBlock,+idxTs,"no cloud parameter") && success;
                    }
                }
                else{
                    success = this.removePoint(+idxBlock,+idxTs,"no cloud asset") && success;
                }
            }
        }

        return success;
    }

    private removePoint(idxBlock: number, idxTs: number, reason: string): boolean{
        let success = true;

        logger.error(`Removing point ${this.unsentLists[idxBlock][idxTs].ts.Parameter} | ${this.unsentLists[idxBlock][idxTs].device.value} - ${reason}!`, 60000);
        const removed = this.unsentLists[idxBlock].splice(idxTs, 1);
        if (removed.length!=1){
            success = false;
            logger.fatal(`Cannot remove timeseries element! Missing asset: ${this.unsentLists[idxBlock][idxTs].device.value}`);
        }

        return success;
    }


    //#endregion

}
