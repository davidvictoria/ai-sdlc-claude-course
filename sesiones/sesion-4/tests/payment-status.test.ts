import { describe, expect, it } from 'vitest';
import { normalizeProviderStatus } from '../src/domain/payment-status.js';

describe('normalizeProviderStatus', () => {
  it('maps PENDING to PENDING (still PENDING after the PROCESSING fix)', () => {
    expect(normalizeProviderStatus('PENDING')).toBe('PENDING');
  });

  it('maps PROCESSING to PENDING (session 1 fix)', () => {
    expect(normalizeProviderStatus('PROCESSING')).toBe('PENDING');
  });

  it('maps APPROVED to APPROVED', () => {
    expect(normalizeProviderStatus('APPROVED')).toBe('APPROVED');
  });

  it('maps DECLINED to DECLINED', () => {
    expect(normalizeProviderStatus('DECLINED')).toBe('DECLINED');
  });

  it('maps REVERSED to REVERSED (PAY-104)', () => {
    expect(normalizeProviderStatus('REVERSED')).toBe('REVERSED');
  });

  it('maps an empty string to UNKNOWN', () => {
    expect(normalizeProviderStatus('')).toBe('UNKNOWN');
  });

  it('maps null to UNKNOWN', () => {
    expect(normalizeProviderStatus(null)).toBe('UNKNOWN');
  });

  it('maps undefined to UNKNOWN', () => {
    expect(normalizeProviderStatus(undefined)).toBe('UNKNOWN');
  });

  it('maps an unrecognized value to UNKNOWN', () => {
    expect(normalizeProviderStatus('SOMETHING_ELSE')).toBe('UNKNOWN');
  });

  it('trims surrounding whitespace before comparing', () => {
    expect(normalizeProviderStatus('  APPROVED  ')).toBe('APPROVED');
  });

  it('is case-sensitive: lowercase input is not recognized', () => {
    expect(normalizeProviderStatus('approved')).toBe('UNKNOWN');
  });
});
