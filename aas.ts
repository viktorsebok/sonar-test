const PASSWORD = "wfffew545gg";

export interface Shell {
    assetAdministrationShells?: AssetAdministrationShell[];
    assets?:                    Asset[];
    conceptDescriptions?:       ConceptDescription[];
    submodels?:                 Submodel[];
}

export interface AssetAdministrationShell {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    administration?:             AdministrativeInformation;
    identification:              Identifier;
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    assetInformation:            AssetInformation;
    derivedFrom?:                Reference;
    security?:                   Security;
    submodels?:                  Reference[];
    views?:                      View[];
}

export interface AdministrativeInformation {
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    revision?:                   string;
    version?:                    string;
}

export interface EmbeddedDataSpecification {
    dataSpecification:        Reference;
    dataSpecificationContent: { [key: string]: any };
}

export interface Reference {
    keys: Key[];
}

export interface Key {
    idType: KeyType;
    type:   KeyElements;
    value:  string;
}

export enum KeyType {
    Custom = "Custom",
    FragmentID = "FragmentId",
    IDShort = "IdShort",
    IRI = "IRI",
    Irdi = "IRDI",
}

export enum KeyElements {
    AccessPermissionRule = "AccessPermissionRule",
    AnnotatedRelationshipElement = "AnnotatedRelationshipElement",
    Asset = "Asset",
    AssetAdministrationShell = "AssetAdministrationShell",
    BasicEvent = "BasicEvent",
    Blob = "Blob",
    Capability = "Capability",
    ConceptDescription = "ConceptDescription",
    ConceptDictionary = "ConceptDictionary",
    DataElement = "DataElement",
    Entity = "Entity",
    Event = "Event",
    File = "File",
    FragmentReference = "FragmentReference",
    GlobalReference = "GlobalReference",
    MultiLanguageProperty = "MultiLanguageProperty",
    Operation = "Operation",
    Property = "Property",
    Range = "Range",
    ReferenceElement = "ReferenceElement",
    RelationshipElement = "RelationshipElement",
    Submodel = "Submodel",
    SubmodelElement = "SubmodelElement",
    SubmodelElementCollection = "SubmodelElementCollection",
    View = "View",
}

export interface AssetInformation {
    assetKind:         AssetKind;
    billOfMaterial?:   Reference[];
    defaultThumbnail?: File;
    globalAssetId?:    Reference;
    specificAssetIds?: IdentifierKeyValuePair[];
}

export enum AssetKind {
    Instance = "Instance",
    Type = "Type",
}

export interface File {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    kind?:                       ModelingKind;
    semanticId?:                 Reference;
    qualifiers?:                 Constraint[];
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    mimeType:                    string;
    value?:                      string;
}

export interface LangString {
    language: string;
    text:     string;
}

export interface Extension {
    semanticId?: Reference;
    name:        string;
    refersTo?:   Reference;
    value?:      string;
    valueType?:  DataTypeDef;
}

export enum DataTypeDef {
    AnyURI = "anyUri",
    Base64Binary = "base64Binary",
    Boolean = "boolean",
    Byte = "byte",
    Date = "date",
    DateTime = "dateTime",
    DateTimeStamp = "dateTimeStamp",
    DayTimeDuration = "dayTimeDuration",
    Decimal = "decimal",
    Double = "double",
    Duration = "duration",
    Entity = "ENTITY",
    Float = "float",
    GDay = "gDay",
    GMonth = "gMonth",
    GMonthDay = "gMonthDay",
    GYear = "gYear",
    GYearMonth = "gYearMonth",
    HexBinary = "hexBinary",
    ID = "ID",
    Idref = "IDREF",
    Int = "int",
    Integer = "integer",
    Language = "language",
    Long = "long",
    NCName = "NCName",
    Name = "Name",
    NegativeInteger = "negativeInteger",
    Nmtoken = "NMTOKEN",
    NonNegativeInteger = "nonNegativeInteger",
    NonPositiveInteger = "nonPositiveInteger",
    NormalizedString = "normalizedString",
    Notation = "NOTATION",
    PositiveInteger = "positiveInteger",
    QName = "QName",
    Short = "short",
    String = "string",
    Time = "time",
    Token = "token",
    UnsignedByte = "unsignedByte",
    UnsignedInt = "unsignedInt",
    UnsignedLong = "unsignedLong",
    UnsignedShort = "unsignedShort",
    YearMonthDuration = "yearMonthDuration",
}

export enum ModelingKind {
    Instance = "Instance",
    Template = "Template",
}

export interface ModelType {
    name: ModelTypes;
}

export enum ModelTypes {
    AccessPermissionRule = "AccessPermissionRule",
    AnnotatedRelationshipElement = "AnnotatedRelationshipElement",
    Asset = "Asset",
    AssetAdministrationShell = "AssetAdministrationShell",
    BasicEvent = "BasicEvent",
    Blob = "Blob",
    BlobCertificate = "BlobCertificate",
    Capability = "Capability",
    ConceptDescription = "ConceptDescription",
    Entity = "Entity",
    File = "File",
    Formula = "Formula",
    MultiLanguageProperty = "MultiLanguageProperty",
    Operation = "Operation",
    Property = "Property",
    Qualifier = "Qualifier",
    Range = "Range",
    ReferenceElement = "ReferenceElement",
    RelationshipElement = "RelationshipElement",
    Submodel = "Submodel",
    SubmodelElementCollection = "SubmodelElementCollection",
    View = "View",
}

export interface Constraint {
    modelType: ModelType;
}

export interface IdentifierKeyValuePair {
    semanticId?:       Reference;
    externalSubjectId: Reference;
    key:               string;
    value:             string;
}

export interface Identifier {
    id:     string;
    idType: IdentifierType;
}

export enum IdentifierType {
    Custom = "Custom",
    IRI = "IRI",
    Irdi = "IRDI",
}

export interface Security {
    accessControlPolicyPoints:      AccessControlPolicyPoints;
    certificates?:                  Certificate[];
    requiredCertificateExtensions?: Reference[];
}

export interface AccessControlPolicyPoints {
    policyAdministrationPoint: PolicyAdministrationPoint;
    policyDecisionPoint:       PolicyDecisionPoint;
    policyEnforcementPoints:   PolicyEnforcementPoints;
    policyInformationPoints?:  PolicyInformationPoints;
}

export interface PolicyAdministrationPoint {
    externalAccessControl: boolean;
    localAccessControl?:   AccessControl;
}

export interface AccessControl {
    accessPermissionRules?:           AccessPermissionRule[];
    defaultEnvironmentAttributes?:    Reference;
    defaultPermissions:               Reference;
    defaultSubjectAttributes:         Reference;
    selectableEnvironmentAttributes?: Reference;
    selectablePermissions?:           Reference;
    selectableSubjectAttributes?:     Reference;
}

export interface AccessPermissionRule {
    extensions?:             Extension[];
    category?:               string;
    description?:            LangString[];
    displayName?:            LangString[];
    idShort:                 string;
    modelType:               ModelType;
    qualifiers?:             Constraint[];
    permissionsPerObject?:   PermissionsPerObject[];
    targetSubjectAttributes: SubjectAttributes;
}

export interface PermissionsPerObject {
    object:                  Reference;
    permissions?:            Permission[];
    targetObjectAttributes?: ObjectAttributes;
}

export interface Permission {
    kindOfPermission: PermissionKind;
    permission:       Reference;
}

export enum PermissionKind {
    Allow = "Allow",
    Deny = "Deny",
    NotApplicable = "NotApplicable",
    Undefined = "Undefined",
}

export interface ObjectAttributes {
    objectAttributes: Reference[];
}

export interface SubjectAttributes {
    subjectAttributes: Reference[];
}

export interface PolicyDecisionPoint {
    externalPolicyDecisionPoints: boolean;
}

export interface PolicyEnforcementPoints {
    externalPolicyEnforcementPoint: boolean;
}

export interface PolicyInformationPoints {
    externalInformationPoints:  boolean;
    internalInformationPoints?: Reference[];
}

export interface Certificate {
    modelType:                 ModelType;
    policyAdministrationPoint: PolicyAdministrationPoint;
}

export interface View {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    semanticId?:                 Reference;
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    containedElements?:          Reference[];
}

export interface Asset {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    administration?:             AdministrativeInformation;
    identification:              Identifier;
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
}

export interface ConceptDescription {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    administration?:             AdministrativeInformation;
    identification:              Identifier;
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    isCaseOf?:                   Reference[];
}

export interface Submodel {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    administration?:             AdministrativeInformation;
    identification:              Identifier;
    kind?:                       ModelingKind;
    semanticId?:                 Reference;
    qualifiers?:                 Constraint[];
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
    submodelElements?:           SubmodelElement[];
}

export interface SubmodelElement {
    extensions?:                 Extension[];
    category?:                   string;
    description?:                LangString[];
    displayName?:                LangString[];
    idShort:                     string;
    modelType:                   ModelType;
    kind?:                       ModelingKind;
    semanticId?:                 Reference;
    qualifiers?:                 Constraint[];
    embeddedDataSpecifications?: EmbeddedDataSpecification[];
}
