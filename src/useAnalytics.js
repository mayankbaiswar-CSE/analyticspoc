import MetalClient, { BrowserMetricsPlugin, ResourceMetricsPlugin } from '@atlassiansox/metal-client';
import AnalyticsWebClient, {
    envType,
    originType,
    tenantType,
    userType,
    eventType,
    platformType,
} from '@atlassiansox/analytics-web-client';

const ANALYTICS_NODE = '[data-analytics]';
const OBSERVABILITY_NODE = '[data-observability]';

export const GasEventTypes = {
    SCREEN: 'screen',
    TRACK: 'track',
    UI: 'ui',
    OPERATIONAL: 'operational',
};

export const AnalyticsConfig = {
    [GasEventTypes.TRACK]: {
        SUBJECT: {
            CHANGE_PRICING_PLAN: 'changePricingPlan',
        }
    },
    [GasEventTypes.UI]: {
        ACTION: {
            CLICKED: 'clicked',
            SEARCHED: '`searched',
            CHANGED: 'changed',
        },
        SUBJECT: {
            BUTTON: 'button',
            LINK: 'link',
            NAV_ITEM: 'navItem',
            TABLE_ROW: 'tableRow',
            FORM: 'form',
            FILTER: 'filter',
        },
        SUBJECTID: {
            OPENSIDEBARLINK: 'openSidebarLink'
        }
    },
    [GasEventTypes.SCREEN]: {

    },
    [GasEventTypes.OPERATIONAL]: {

    }
}

const getAnalyticsConfig = (eventConfig, eventType) => {
    if (!eventConfig) {
        console.error('Not a valid analytics event config.');
        return;
    }
    let baseConfig = {
        containers: {
            project: {
                id: 'css-xp',
            },
        }
    }

    switch (eventType) {
        case GasEventTypes.TRACK:
        case GasEventTypes.OPERATIONAL:
        case GasEventTypes.UI:
            // console.log(event);
            const actionSubjectId = eventConfig.actionsubjectid;
            const actionSubject = eventConfig.actionsubject;
            const action = eventConfig.action;
            if (!actionSubjectId || !actionSubject || !action) {
                console.error(`Please make sure to set actionsubjectid, actionsubject, action on the HTML element for sending UI events`);
                return;
            }
            return {
                ...baseConfig,
                actionSubjectId,
                actionSubject,
                action
            }
    }
}

const useAnalytics = () => {

    const sendObservability = () => {
        const productInfo = {
            metalId: 'your-metal-id-here',
            version: '1.0.2',
            env: envType.STAGING,
        };

        const plugins = [
            new BrowserMetricsPlugin({ rootId: 'root' }),
            // new ResourceMetricsPlugin(),
        ];

        new MetalClient({ productInfo, plugins });

    }

    const sendAnalytics = (source, eventType) => {

        const analyticsClient = new AnalyticsWebClient({
            env: envType.DEV, // required
            product: 'css-xp', // required
            version: '1.0.0',
            origin: originType.DESKTOP, // defaults to WEB if not specified
            platform: platformType.MAC, // defaults to WEB if not specified
            locale: 'en-US',
        });
        analyticsClient.setTenantInfo(tenantType.NONE);

        let sendEvent;
        switch (eventType) {
            case GasEventTypes.UI:
                sendEvent = analyticsClient.sendUIEvent;
                break;
            case GasEventTypes.SCREEN:
                sendEvent = analyticsClient.sendScreenEvent;
                break;
            case GasEventTypes.TRACK:
                sendEvent = analyticsClient.sendTrackEvent;
                break;
            case GasEventTypes.OPERATIONAL:
                sendEvent = analyticsClient.sendOperationalEvent;
                break;
        }

        const eventAnalyticsHandler = (eventConfig) => {
            try {
                const config = getAnalyticsConfig(eventConfig, eventType);
                sendEvent({ ...config, source });
            } catch (err) {
                console.error(err);
            }
        }

        switch (eventType) {
            case GasEventTypes.SCREEN:
                sendEvent({ name: source });
                break;
            default:
                return eventAnalyticsHandler;
        }
    }

    const sendErrors = () => {
        // for sentry
    }

    return { sendObservability, sendAnalytics, sendErrors };
}

export default useAnalytics;