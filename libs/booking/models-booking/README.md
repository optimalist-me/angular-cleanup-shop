# booking/models-booking

This library contains type definitions and models for the booking domain.

## Contents

- `BookingStep` - Step identifiers for the booking wizard (info → schedule → confirm)
- `BookingStatus` - Status of a booking submission (idle, submitting, success, error)
- `BookingRequest` - Request payload for booking submissions
- `BookingResponse` - Response from booking API
- `BookingDraft` - Partial booking data during form editing
