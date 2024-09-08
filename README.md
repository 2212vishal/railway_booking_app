# IRCTC Backend Project

## Setup

1. Clone the repository to your local machine.
2. Prepare the `.env` file with your MySQL database URL, JWT key, and port.
3. Run `npm install` in your terminal.
4. Then run the start command: `npm run dev`.

## Sample of some Routes ( Train Routes ):

### Add a Train

- **Route:** `POST /api/v1/trains/add`
- **Description:** Add a new train to the system.
- **Request Body (JSON):**
  - `train_name` (String): Name of the train
  - `train_number` (String): Train number (unique)
  - `total_seats` (Integer): Total number of seats
- **Example Usage (Postman):**
  - Set request type to POST
  - Set URL to `https://your-api-url/api/v1/trains/add`
  - Go to the Body tab, select raw and JSON, and add the required fields
  - Click Send

## Booking Routes

### Check Seat Availability

- **Route:** `GET /api/v1/bookings/availability`
- **Description:** Check the availability of seats on a train between two stations.
- **Query Parameters:**
  - `source_station_id` (Integer): ID of the source station
  - `destination_station_id` (Integer): ID of the destination station
- **Example Usage (Postman):**
  - Set request type to GET
  - Set URL to `https://your-api-url/api/v1/bookings/availability?source_station_id=1&destination_station_id=2`
  - Click Send

### Book a Seat

- **Route:** `POST /api/v1/bookings/book`
- **Description:** Book a seat on a train.
- **Request Body (JSON):**
  - `user_id` (Integer): ID of the user making the booking
  - `train_id` (Integer): ID of the train
  - `seat_id` (Integer): ID of the seat
  - `source_station_id` (Integer): ID of the source station
  - `destination_station_id` (Integer): ID of the destination station
  - `booking_date` (Date): Date of booking
- **Example Usage (Postman):**
  - Set request type to POST
  - Set URL to `https://your-api-url/api/v1/bookings/book`
  - Go to the Body tab, select raw and JSON, and add the required fields
  - Click Send

### Get Booking Details

- **Route:** `GET /api/v1/bookings/booking/:booking_id`
- **Description:** Get details of a specific booking.
- **Example Usage (Postman):**
  - Set request type to GET
  - Set URL to `https://your-api-url/api/v1/bookings/booking/123`
  - Click Send

---
VISHAL , vishal20120073623@gmail.com / vishal_ug20@nsut.ac.in

