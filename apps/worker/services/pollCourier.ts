import { ProviderKey } from '../constants/provider';
import { getCourierAdapter } from '../couriers/factory';
import { credentialsService } from './credentials.service';
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
  const credentials = await credentialsService.getCredentials({clientId, provider, key: 'Token'});

  await assertProviderEnabled(provider);

  await checkCircuit(provider);
  const start = Date.now();
  try {
    const result = await adapter.track(clientId, awb);

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