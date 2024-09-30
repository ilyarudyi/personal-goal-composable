type ThreekitAuthProps = {
    orgId: string;
    host: string;
    publicToken: string;
    branch?: string | undefined;
} | {
    orgId: string;
    host: string;
    privateToken: string;
    branch?: string | undefined;
} | {
    orgId: string;
    host: string;
    cookie: string;
    branch?: string | undefined;
}

type Configuration = {
    [attributeName: string]: string | number | boolean | {
        r: number;
        g: number;
        b: number;
    } | {
        type?: string | undefined;
        assetId: string;
        configuration?: string | Configuration | undefined;
    } | {
        type?: string | undefined;
        assetId: string;
        configuration?: string | undefined;
    }[] | null;
}

type ExporterSettings = {
    arExport?: boolean;
    prune?: {
        invisible?: boolean;
        childless?: boolean;
        lights?: boolean;
        environment?: boolean;
    };
};