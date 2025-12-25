import { ProviderKey } from '../constants/provider';
import { getCourierAdapter } from '../couriers/factory';
import { getCourierCredentials } from './credentials.service';
import { incrMetric, observeLatency } from '../utils/metrics';
import {
  checkCircuit,
  recordFailure,
  recordSuccess,
} from '../utils/circuitBreaker';
import { assertProviderEnabled } from './providerGuard';

export async function pollCourier(
  clientId: number,
  provider: ProviderKey,
  awb: string
) {
  const adapter = getCourierAdapter(provider);
  const credentials = await getCourierCredentials(clientId, provider);

  await assertProviderEnabled(provider);

  await checkCircuit(provider);
  const start = Date.now();
  try {
    const result = await adapter.track(awb, credentials);

    await incrMetric('tracking_success', {
      provider,
      clientId: String(clientId),
    });

    await observeLatency(
      'tracking',
      Date.now() - start,
      { provider }
    );

    await recordSuccess(provider);
    return result;
  } 
  catch (error) 
  {
    await incrMetric('tracking_failure', {
      provider,
      clientId: String(clientId),
    });

    throw error;
  }
}