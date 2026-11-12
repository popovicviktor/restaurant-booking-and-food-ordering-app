# Restaurant Booking and Food Ordering App

A web application for booking tables in restaurants and ordering food for delivery. It was made as a project for the course **Internet Application Programming** at the School of Electrical Engineering, University of Belgrade (academic year 2023/24).

The app has three types of users: **guests**, **waiters** and **administrators**. Each of them has their own pages and options.

---

## Tech stack

The project is built with the MEAN stack.

**Client side**
- Angular
- Bootstrap for the layout and responsive design
- Chart.js for the waiter statistics diagrams

**Server side**
- Node.js and Express
- crypto-js for password encryption
- multer for uploading profile pictures

**Database**
- MongoDB

---

## Login and registration

Guests and waiters log in on the public login page, while the administrator has a separate login page that is not linked from the public pages. If the username or password is wrong, an error message is displayed.

A new guest registers with a username, password, security question and answer, name, surname, gender, address, phone number, email, profile picture and credit card number. The profile picture is a JPG or PNG file, and a default picture is used if none is uploaded. The data is checked on the client side before it is sent to the server. The username and email have to be unique, and the password must have 6 to 10 characters, start with a letter and contain at least one uppercase letter, three lowercase letters, one number and one special character. Passwords are stored encrypted.

Registration creates a **registration request**, not an active account. The guest can't log in until the administrator accepts the request. If the administrator rejects it, the account is never created.

A password can be changed by entering the old password, or, if it is forgotten, by entering the username and answering the security question. In both cases the new password is entered twice.

---

## Landing page

The landing page is open to everyone, even without logging in. It shows:

- the number of restaurants and the number of registered guests
- the number of reservations in the last 24 hours, 7 days and 30 days
- a list of restaurants together with the names of their waiters

The list can be sorted by name, address and type (both ascending and descending), and searched by name, address and type. Any combination of these fields can be used. Visitors can also go to the login and registration pages from here.

---

## Guest

After logging in, the guest sees a main menu with four pages: Profile, Restaurants, Reservations and Food delivery.

### Profile

The guest can check and update their data and profile picture.

### Restaurants

**Displayed:**
- The same restaurant table as on the landing page, with the same search and sorting options.
- The average rating of each restaurant, both as a number and as stars.
- A details page for each restaurant, opened by clicking on its name. It shows the name, address, type, phone number and all comments.

**Actions** (from the details page):
- Reserve a table by choosing the date and time, the number of people and, optionally, adding a note. Each reservation is for one table. The reservation is validated, and the guest gets a message if the restaurant doesn't work on that day or if there is no free table.
- Browse the menu (with the name, picture, price and ingredients of each dish), choose quantities, add dishes to the cart, edit the cart and finish the order for home delivery.

### Reservations

**Displayed:**
- A table with current reservations.
- A table with past reservations, sorted from the most recent to the oldest.

**Actions:**
- Cancel a current reservation up to 45 minutes before it starts.
- Leave a comment and a rating from 1 to 5 stars for a past reservation, but only if they actually came to the restaurant.

### Food delivery

**Displayed:**
- Current deliveries (requested or confirmed by the waiter), with the date, time, restaurant, order status and estimated delivery time, which appears once the waiter confirms the order.
- The archive of past deliveries (delivered or rejected), with the date, price, restaurant and status.

---

## Waiter

Every waiter is assigned to exactly one restaurant. After logging in, they see a main menu with four pages: Profile, Reservations, Deliveries and Statistics.

### Profile

The waiter can check and update their data and profile picture.

### Reservations

**Displayed:**
- All unprocessed reservations for their restaurant, sorted by date, starting with the most recent.

**Actions:**
- Confirm or reject each reservation. A comment is required when rejecting. When confirming, the waiter chooses a free table from a dropdown list, and the reservation becomes their responsibility.
- Half an hour after a reservation ends, mark whether the guests showed up or not:
  - If they didn't come, the table is freed right away. A guest who doesn't show up 3 times is blocked from making new reservations, and only the administrator can unblock them.
  - If they came, the table is freed 3 hours after the reservation started.
- Extend the table for one more hour, but only once per stay.

### Deliveries

**Displayed:**
- The current orders.

**Actions:**
- Confirm or reject each order. When confirming, they choose the estimated delivery time (20-30, 30-40 or 50-60 minutes).
- Mark a confirmed delivery as finished.

### Statistics

**Displayed:** three diagrams:
- A bar chart with the number of guests per day of the week for that waiter, based on the reservations they handled.
- A pie chart with the share of reservations handled by each waiter of the restaurant.
- A histogram showing how the waiter's reservations from the last 24 months are spread across the days of the week, in percent.

---

## Administrator

The administrator is a special user with extra privileges. They can:

- See the lists of all guests, waiters and restaurants.
- Update user data and deactivate users. The data of a deactivated user stays in the database, but the user can no longer log in. Blocked guests can also be unblocked by the administrator.
- Review registration requests and accept or reject them. A username and email from a rejected request can't be used for new registrations.
- Add new waiters.
- Add new restaurants by entering the name, type, address, short description and contact person. The layout of the tables, kitchen and restrooms is loaded from a JSON file. A layout needs at least one kitchen, one restroom and three tables, and each table has a maximum number of people.
- Set the working hours of the kitchen for each restaurant. Reservations can only be made within those hours.
