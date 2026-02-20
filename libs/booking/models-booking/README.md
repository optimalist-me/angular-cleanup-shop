# booking/models-booking

This library contains type definitions and models for the booking domain.

## Contents

- `BookingStep` - Step identifiers for checkout (review → details → schedule)
- `BookingStatus` - Status of a booking submission (idle, submitting, success, error)
- `BookingPainArea` - Standardized qualification category selected in checkout
- `BookingRequest` - Request payload created by checkout
- `CreateBookingResponse` - API response for booking creation
- `BookingDetails` / `GetBookingResponse` - Response shape for confirmation lookup
