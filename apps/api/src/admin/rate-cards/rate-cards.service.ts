import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { rateCards, rateCardSlabs } from '../../db/schema';
import { and, eq, isNull } from 'drizzle-orm';

@Injectable()
export class RateCardsService {

  /* ----------------------------------------
     GET RATE CARD (UI LOAD)
  ---------------------------------------- */
  async getRateCard(
    provider: string,
    serviceType: string,
    clientId?: number | null,
  ) {
    const providerKey = provider.toLowerCase();
    const serviceKey = serviceType.toLowerCase();

    // -------------------------------
    // CLIENT MODE (STRICT)
    // -------------------------------
    if (clientId) {
      const [clientCard] = await db
        .select()
        .from(rateCards)
        .where(
          and(
            eq(rateCards.provider, providerKey),
            eq(rateCards.service_type, serviceKey),
            eq(rateCards.client_id, clientId),
            eq(rateCards.is_active, true),
          )
        )
        .limit(1);

      if (!clientCard) {
        return {
          rateCardId: null,
          provider: providerKey,
          serviceType: serviceKey,
          clientId,
          slabs: [],
          notConfigured: true,
        };
      }

      return this.loadRateCard(clientCard);
    }

    // -------------------------------
    // GLOBAL MODE
    // -------------------------------
    let [globalCard] = await db
      .select()
      .from(rateCards)
      .where(
        and(
          eq(rateCards.provider, providerKey),
          eq(rateCards.service_type, serviceKey),
          isNull(rateCards.client_id),
          eq(rateCards.is_active, true),
        )
      )
      .limit(1);

    if (!globalCard) {
      [globalCard] = await db
        .insert(rateCards)
        .values({
          provider: providerKey,
          service_type: serviceKey,
          client_id: null,
          is_active: true,
          created_by: 1,
        })
        .returning();

      await this.createEmptySlabs(globalCard.id);
    }

    return this.loadRateCard(globalCard);
  }

  /* ----------------------------------------
     UPDATE RATE (INLINE CELL)
  ---------------------------------------- */
  async updateRate(
    rateCardId: number,
    zoneCode: string,
    slabType: string,
    rate: number,
  ) {
    if (!rateCardId) {
      throw new NotFoundException('Rate card not created');
    }

    const [row] = await db
      .insert(rateCardSlabs)
      .values({
        rate_card_id: rateCardId,
        zone_code: zoneCode,
        slab_type: slabType,
        rate: rate.toString(),
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          rateCardSlabs.rate_card_id,
          rateCardSlabs.zone_code,
          rateCardSlabs.slab_type,
        ],
        set: {
          rate: rate.toString(),
          updated_at: new Date(),
        },
      })
      .returning();

    return row;
  }

  /* ----------------------------------------
     CREATE CLIENT RATE CARD (EXPLICIT)
  ---------------------------------------- */
  async createClientRateCard(
    provider: string,
    serviceType: string,
    clientId: number,
    cloneFromGlobal = true,
  ) {
    const providerKey = provider.toLowerCase();
    const serviceKey = serviceType.toLowerCase();

    const [existing] = await db
      .select()
      .from(rateCards)
      .where(
        and(
          eq(rateCards.provider, providerKey),
          eq(rateCards.service_type, serviceKey),
          eq(rateCards.client_id, clientId),
        )
      )
      .limit(1);

    if (existing) return existing;

    const [card] = await db
      .insert(rateCards)
      .values({
        provider: providerKey,
        service_type: serviceKey,
        client_id: clientId,
        is_active: true,
        created_by: 1,
      })
      .returning();

    if (cloneFromGlobal) {
      await this.cloneFromGlobal(card.id, providerKey, serviceKey);
    } else {
      await this.createEmptySlabs(card.id);
    }

    return card;
  }

  /* ----------------------------------------
     HELPERS
  ---------------------------------------- */
  private async loadRateCard(card: any) {
    const slabs = await db
      .select()
      .from(rateCardSlabs)
      .where(eq(rateCardSlabs.rate_card_id, card.id));

    return {
      rateCardId: card.id,
      provider: card.provider,
      serviceType: card.service_type,
      clientId: card.client_id ?? null,
      slabs,
      notConfigured: false,
    };
  }

  private async createEmptySlabs(rateCardId: number) {
    const rows = [];

    for (const zone of ZONES) {
      for (const s of SLABS) {
        rows.push({
          rate_card_id: rateCardId,
          zone_code: zone,
          slab_type: s.slabType,
          min_weight_g: s.min,
          max_weight_g: s.max,
          rate: '0',
        });
      }
    }

    await db.insert(rateCardSlabs).values(rows);
  }

  private async cloneFromGlobal(
    clientRateCardId: number,
    provider: string,
    serviceType: string,
  ) {
    const [globalCard] = await db
      .select()
      .from(rateCards)
      .where(
        and(
          eq(rateCards.provider, provider),
          eq(rateCards.service_type, serviceType),
          isNull(rateCards.client_id),
        )
      )
      .limit(1);

    if (!globalCard) {
      await this.createEmptySlabs(clientRateCardId);
      return;
    }

    const globalSlabs = await db
      .select()
      .from(rateCardSlabs)
      .where(eq(rateCardSlabs.rate_card_id, globalCard.id));

    await db.insert(rateCardSlabs).values(
      globalSlabs.map(s => ({
        rate_card_id: clientRateCardId,
        zone_code: s.zone_code,
        slab_type: s.slab_type,
        min_weight_g: s.min_weight_g,
        max_weight_g: s.max_weight_g,
        rate: s.rate,
      }))
    );
  }
}

const ZONES = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'E', 'F'];

const SLABS = [
  { slabType: 'BASE', min: 0, max: 250 },
  { slabType: 'ADD_250', min: 251, max: 500 },
  { slabType: 'ADD_500', min: 501, max: 5000 },
  { slabType: 'ADD_1KG', min: 5001, max: null },
  { slabType: 'RTO_BASE', min: null, max: null },
  { slabType: 'DTO_BASE', min: null, max: null },
];