\# Signatures Customer App — UI/UX Tracker



\## Current Phase

Customer mobile application UI redesign.



Reference:

Food delivery UI/UX specification created from the selected design.



\---



\## HOME SCREEN



\### Working

\- \[x] Native React Native Home screen

\- \[x] Orange / black design system

\- \[x] Delivery location header

\- \[x] Notification button

\- \[x] Search bar

\- \[x] Filter button

\- \[x] Category selector

\- \[x] Popular food cards

\- \[x] Restaurant section

\- \[x] Floating bottom navigation

\- \[x] Food images loading



\### Needs Fixing



\- \[ ] Replace manual bottom navigation with React Navigation

\- \[ ] Bottom navigation currently overlaps restaurant content

\- \[ ] Improve responsive food-card widths

\- \[ ] Prevent food names such as "Classic Burger" from clipping

\- \[ ] Make delivery location functional

\- \[ ] Make search functional

\- \[ ] Make filter button functional

\- \[ ] Make category buttons functional

\- \[ ] Make "See all" buttons functional

\- \[ ] Make food cards clickable

\- \[ ] Make favorite buttons functional

\- \[ ] Make restaurant cards clickable

\- \[ ] Connect real restaurant/menu data

\- \[ ] Replace temporary remote images with production data/images

\- \[ ] Add loading states

\- \[ ] Add empty states

\- \[ ] Add error states



\---



\## NAVIGATION



\- \[ ] Create AppNavigator

\- \[ ] Create Home tab

\- \[ ] Create Search tab

\- \[ ] Create Orders tab

\- \[ ] Create Profile tab

\- \[ ] Add Restaurant Details stack

\- \[ ] Add Food Details stack

\- \[ ] Add Cart

\- \[ ] Add Checkout

\- \[ ] Add Order Confirmation

\- \[ ] Add Live Tracking



\---



\## CUSTOMER SCREENS



\### Home

\- \[x] Initial UI

\- \[ ] Functional interactions

\- \[ ] Final polish



\### Search

\- \[ ] UI

\- \[ ] Search logic

\- \[ ] Filters

\- \[ ] Results



\### Restaurant

\- \[ ] Restaurant details

\- \[ ] Menu categories

\- \[ ] Menu items

\- \[ ] Restaurant information



\### Food Details

\- \[ ] Hero food image

\- \[ ] Food information

\- \[ ] Size selector

\- \[ ] Extras/add-ons

\- \[ ] Quantity selector

\- \[ ] Special instructions

\- \[ ] Add to cart



\### Cart

\- \[ ] Cart items

\- \[ ] Quantity controls

\- \[ ] Remove item

\- \[ ] Promo code

\- \[ ] Price breakdown

\- \[ ] Checkout button



\### Checkout

\- \[ ] Delivery address

\- \[ ] Delivery instructions

\- \[ ] Payment method

\- \[ ] Order summary

\- \[ ] Place order



\### Orders

\- \[ ] Active orders

\- \[ ] Order history

\- \[ ] Order details

\- \[ ] Reorder



\### Tracking

\- \[ ] Order status

\- \[ ] Driver information

\- \[ ] Map

\- \[ ] ETA

\- \[ ] Contact driver

\- \[ ] Delivery confirmation



\### Profile

\- \[ ] Account

\- \[ ] Saved addresses

\- \[ ] Payment methods

\- \[ ] Favorites

\- \[ ] Notifications

\- \[ ] Settings



\---



\## DEVELOPMENT NOTES



Do not redesign the old WebView implementation.



Customer application should use native React Native components.



Existing backend functionality should be preserved.



Do not run:

npm audit fix --force



without reviewing dependency changes first.

