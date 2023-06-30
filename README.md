# Project to automate a retail outlet on ZendSkeletonApplication

## Introduction

This project contains 2 main pages
- user page - for user interaction.
- operator page - for checking incoming bookings.

## Installation

```bash
$ git clone https://github.com/blackb1tch/skeleton-bms32.local
```
You also need to import the database. Go to directory /skeleton-bms32.local/public/database and import file .sql .

After installation go to directory skeleton-bms32.local/public/webpack to build project:

```bash
$ webpack
```

## User Page

On this page user can search for spare parts in the catalog, or book a time for repair.
Booking is possible for today and tomorrow. Just enter what you want to repair in input field and click "Поиск".
And then you can see time-slots for choosing not booked time. If you select an available time slot, you will see a feedback form.

## Operator Page

On this page, you can see all the bookings that users have left. You can confirm, cancel, edit bookings.
In the filter you can:
- switch between confirmed, rejected and new bookings;
- customize the sorting;
- search bookings by id, name, email, phone, by create date period;
