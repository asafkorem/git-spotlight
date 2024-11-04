interface Window {
    gtag: (
        command: 'config' | 'event' | 'js',
        targetId: string,
        config?: AnalyticsConfig | Date | undefined
    ) => void;
    dataLayer: unknown[];
}

interface AnalyticsConfig {
    page_path: string;
    [key: string]: string;
}
