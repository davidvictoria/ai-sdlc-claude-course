import { describe, expect, it } from 'vitest';
import { assertValidTransition, InvalidTransitionError } from '../src/domain/transitions.js';

describe('assertValidTransition', () => {
  // Positive transitions (sesion 2)
  it('allows PENDING -> APPROVED', () => {
    expect(() => assertValidTransition('PENDING', 'APPROVED')).not.toThrow();
  });

  it('allows PENDING -> DECLINED', () => {
    expect(() => assertValidTransition('PENDING', 'DECLINED')).not.toThrow();
  });

  // Idempotency: repeating the same status never errors
  it('allows PENDING -> PENDING (idempotent)', () => {
    expect(() => assertValidTransition('PENDING', 'PENDING')).not.toThrow();
  });

  it('allows APPROVED -> APPROVED (idempotent)', () => {
    expect(() => assertValidTransition('APPROVED', 'APPROVED')).not.toThrow();
  });

  it('allows DECLINED -> DECLINED (idempotent)', () => {
    expect(() => assertValidTransition('DECLINED', 'DECLINED')).not.toThrow();
  });

  // Negative transitions: every invalid case from sesion 2
  it('rejects APPROVED -> PENDING', () => {
    expect(() => assertValidTransition('APPROVED', 'PENDING')).toThrow(InvalidTransitionError);
  });

  it('rejects APPROVED -> DECLINED', () => {
    expect(() => assertValidTransition('APPROVED', 'DECLINED')).toThrow(InvalidTransitionError);
  });

  it('rejects DECLINED -> PENDING', () => {
    expect(() => assertValidTransition('DECLINED', 'PENDING')).toThrow(InvalidTransitionError);
  });

  it('rejects DECLINED -> APPROVED', () => {
    expect(() => assertValidTransition('DECLINED', 'APPROVED')).toThrow(InvalidTransitionError);
  });

  // Incoming UNKNOWN is always invalid as a transition target
  it('rejects a transition to UNKNOWN from PENDING', () => {
    expect(() => assertValidTransition('PENDING', 'UNKNOWN')).toThrow(InvalidTransitionError);
  });

  it('rejects a transition to UNKNOWN from APPROVED', () => {
    expect(() => assertValidTransition('APPROVED', 'UNKNOWN')).toThrow(InvalidTransitionError);
  });

  it('includes from/to in the error message', () => {
    expect(() => assertValidTransition('APPROVED', 'PENDING')).toThrow(
      'Invalid payment status transition: APPROVED -> PENDING',
    );
  });

  // PAY-104: REVERSED
  describe('PAY-104: REVERSED', () => {
    it('allows APPROVED -> REVERSED (the only valid transition into REVERSED)', () => {
      expect(() => assertValidTransition('APPROVED', 'REVERSED')).not.toThrow();
    });

    // Acceptance criterion 5: REVERSED is not an exception to the general
    // idempotency rule. A duplicate REVERSED notification from the provider
    // (at-least-once delivery) must be a no-op, not an error.
    it('allows REVERSED -> REVERSED (idempotent)', () => {
      expect(() => assertValidTransition('REVERSED', 'REVERSED')).not.toThrow();
    });

    it('rejects PENDING -> REVERSED', () => {
      expect(() => assertValidTransition('PENDING', 'REVERSED')).toThrow(InvalidTransitionError);
    });

    // Acceptance criterion 3: this case must be verified explicitly, not
    // merely inferred from DECLINED being terminal.
    it('rejects DECLINED -> REVERSED', () => {
      expect(() => assertValidTransition('DECLINED', 'REVERSED')).toThrow(InvalidTransitionError);
    });

    it('rejects REVERSED -> APPROVED (REVERSED is terminal)', () => {
      expect(() => assertValidTransition('REVERSED', 'APPROVED')).toThrow(InvalidTransitionError);
    });

    it('rejects REVERSED -> PENDING (REVERSED is terminal)', () => {
      expect(() => assertValidTransition('REVERSED', 'PENDING')).toThrow(InvalidTransitionError);
    });

    it('rejects REVERSED -> DECLINED (REVERSED is terminal)', () => {
      expect(() => assertValidTransition('REVERSED', 'DECLINED')).toThrow(InvalidTransitionError);
    });

    it('rejects a transition to UNKNOWN from REVERSED', () => {
      expect(() => assertValidTransition('REVERSED', 'UNKNOWN')).toThrow(InvalidTransitionError);
    });

    it('includes from/to in the error message for PENDING -> REVERSED', () => {
      expect(() => assertValidTransition('PENDING', 'REVERSED')).toThrow(
        'Invalid payment status transition: PENDING -> REVERSED',
      );
    });
  });
});
