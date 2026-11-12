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

Guests and waiters log in on the public login page, while the administrator has a separate login page that is not accessible from the public pages. 

Only guests can register, waiters are added by the administrator.

A new guest registers with personal data, a security question and answer, an optional profile picture and a credit card number. The username and email have to be unique, and the password has to meet certain complexity rules.

Passwords are stored encrypted.

Registration creates a registration request, and the guest can't log in until the administrator accepts it.

A password can be changed by entering the old password or, if it is forgotten, by answering the security question.

---

## Landing page

The landing page is open to everyone, even without logging in. It shows:

- the number of restaurants and the number of registered guests
- the number of reservations in the last 24 hours, 7 days and 30 days
- a list of restaurants together with the list of their waiters

The list of restaurants can be sorted and searched.

Visitors can also access the login and registration pages from this page.

---

## Guest

After logging in, the guest sees a main menu with four pages: Profile, Restaurants, Reservations and Food delivery.

### Profile

The guest can check and update their data and profile picture.

### Restaurants

**Displayed:**
- The same restaurant list as on the landing page, with the same search and sorting options.
- The average rating of each restaurant.
- A details page for each restaurant, which shows the name, address, type, phone number and all comments.

**Actions** (from the details page):
- Reserve a table by choosing the date, time and number of people. The guest gets a message if the restaurant doesn't work on that day or if there is no free table.
- Browse the menu, add dishes to the cart and order for home delivery.

### Reservations

**Displayed:**
- A list of current reservations.
- A list of past reservations.

**Actions:**
- Cancel a current reservation up to 45 minutes before it starts.
- Leave a comment and a rating from 1 to 5 stars for a past reservation, but only if the guest actually came to the restaurant.

### Food delivery

**Displayed:**
- Current deliveries, with the estimated delivery time once the waiter confirms.
- The archive of past deliveries (delivered or rejected).

---

## Waiter

Every waiter is assigned to exactly one restaurant. 

After logging in, the waiter sees a main menu with four pages: Profile, Reservations, Deliveries and Statistics.

### Profile

The waiter can check and update their data and profile picture.

### Reservations

**Displayed:**
- All current reservations for the waiter's restaurant.

**Actions:**
- Confirm a reservation by assigning a table to it, or reject it with an explanation.
- Half an hour after a reservation ends, mark whether the guests showed up. A guest who doesn't show up 3 times is blocked from making new reservations, and only the administrator can unblock them.
- Extend the reservation of a table for one more hour, but only once per reservation.

### Deliveries

**Displayed:**
- The current orders.

**Actions:**
- Confirm or reject each order. When confirming, the waiter chooses the estimated delivery time.
- Mark a delivery as finished.

### Statistics

**Displayed:**
- Bar chart of guests handled by the waiter, per day of the week.
- Pie chart of reservations handled by each waiter of the restaurant.
- Histogram of the waiter's reservations over the last 24 months by day of the week.

---

## Administrator

The administrator is a special user with extra privileges and can:

- See the lists of all guests, waiters and restaurants.
- Update user data and deactivate users. The data of a deactivated user stays in the database, but the user can no longer log in. Blocked guests can also be unblocked by the administrator.
- Review registration requests and accept or reject them. A username and email from a rejected request can't be used for new registrations.
- Add new waiters and assign them to a restaurant.
- Add new restaurants.
- Set the working hours of each restaurant. Reservations can only be made within those hours.
