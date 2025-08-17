# Meditation User Story

# 🧘 Meditation App – User Stories  

## 🔑 Login & Registration  

### User Story 1 – User Registration  
**Title:**  
As a user, I want to register by entering my username, email, and password so that I can create an account.  

**Acceptance Criteria:**  
- Users can enter username, email, and password in the registration form.  
- Clicking **“Sign Up”** creates an account if all details are valid.  
- An error message is displayed if any input is invalid or missing.  

**Story Points:** 5  

---

### User Story 2 – User Login  
**Title:**  
As a user, I want to log in using my email and password so that I can access my account.  

**Acceptance Criteria:**  
- Users can enter email and password in the login form.  
- Users with correct credentials are redirected to their dashboard.  
- An error message is displayed for incorrect credentials.  

**Story Points:** 5  

---

### User Story 3 – Validation Feedback  
**Title:**  
As a user, I want to receive feedback when I attempt to sign up or log in without entering details so that I can fix the errors.  

**Acceptance Criteria:**  
- Error messages are displayed for all required missing fields (e.g., “Email is required”).  
- Users cannot proceed without filling mandatory inputs.  
- Error messages are cleared once the user enters valid details.  

**Story Points:** 3  

---

### User Story 4 – Persist User Data  
**Title:**  
As a user, I want my details to be stored in local storage so that my data persists between sessions.  

**Acceptance Criteria:**  
- User details are securely stored in local storage after registration.  
- Stored details are used to authenticate the user during login.  
- Users remain logged in between sessions until they log out.  

**Story Points:** 8  

---

## 🏠 Homepage  

### User Story 1 – Personalized Greeting  
**Title:**  
As a user, I want a personalized greeting with my name and a title so that I feel welcomed and encouraged to meditate.  

**Acceptance Criteria:**  
- Display “Hello, [username]” on the homepage.  
- Display the title “Find your perfect meditation.”  
- If username is unavailable, display “Hello” with no name.  

**Story Points:** 3  

---

### User Story 2 – Popular Meditation Cards  
**Title:**  
As a user, I want to see popular meditation cards so that I can explore options based on my preferences.  

**Acceptance Criteria:**  
- Display cards with image, title, description, category, and duration.  
- Each card shows tags like **Calmness**, **Relaxation**, and time (10–15 minutes).  
- Tapping a card opens the meditation detail page.  
- If no popular items, show an empty state.  

**Story Points:** 8  

---

### User Story 3 – Daily Featured Meditation  
**Title:**  
As a user, I want a daily featured meditation so that I can quickly access a recommended session.  

**Acceptance Criteria:**  
- A dedicated section highlights one meditation with image, title, category, and duration.  
- Featured meditation updates daily.  
- Tapping the card opens detail or starts playback.  

**Story Points:** 5  

---

### User Story 4 – Intuitive Navigation Icons  
**Title:**  
As a user, I want intuitive navigation icons so that I can easily move around the app.  

**Acceptance Criteria:**  
- Display app logo in top-left corner (returns to homepage).  
- Display a settings icon in top-right corner (opens Settings).  
- Icons remain visible and accessible on all standard screen sizes.  

**Story Points:** 3  

---

## 📖 Detailed Exercise Screen  

### User Story 1 – About Section  
**Title:**  
As a user, I want an “About” section for each exercise so that I can understand its benefits and purpose.  

**Acceptance Criteria:**  
- Show a short description under the exercise title.  
- Description explains focus (e.g., relaxation, calmness).  
- Highlight stress-reducing benefits.  

**Story Points:** 3  

---

### User Story 2 – Instructions Section  
**Title:**  
As a user, I want an “Instructions” section for each exercise so that I can perform it correctly.  

**Acceptance Criteria:**  
- Display an expandable “Instructions” section below About.  
- Provide step-by-step guidance on posture and breathing.  
- Instructions are concise and mobile-friendly.  

**Story Points:** 5  

---

### User Story 3 – Add to Favorites  
**Title:**  
As a user, I want an “Add to Favorites” button so that I can easily save an exercise for future practice.  

**Acceptance Criteria:**  
- Prominent **“Add to Favorites”** button at bottom of page.  
- Tapping saves item to Favorites list.  
- Button changes state to **“Added”** with a filled icon.  

**Story Points:** 3  

---

### User Story 4 – Navigation Icons  
**Title:**  
As a user, I want navigation icons for sharing and going back so that I can easily manage the exercise page.  

**Acceptance Criteria:**  
- Back icon in top-left corner returns to previous screen.  
- Share icon in top-right opens device sharing options.  
- Icons are always visible above banner image.  

**Story Points:** 3  

---

## ❤️ Add to Favorites  

### User Story 1 – Add to Favorites  
**Title:**  
As a user, I want to add an item to my Favorites so that I can save activities or articles I like for quick access later.  

**Acceptance Criteria:**  
- Heart icon + **“Add to Favorites”** text next to items.  
- Outlined heart = not in Favorites.  
- Tapping adds item → changes icon to filled + button to **“Remove from Favorites”**.  
- Item appears in Favorites list.  

**Story Points:** 3  

---

### User Story 2 – Remove from Favorites  
**Title:**  
As a user, I want to remove an item from my Favorites so that I can manage my saved content.  

**Acceptance Criteria:**  
- Items already in Favorites show **“Remove from Favorites”** with filled heart.  
- Tapping removes the item and reverts to outlined heart.  
- Add/remove works anytime with real-time updates.  

**Story Points:** 3  

---

### User Story 3 – My Favorites Screen  
**Title:**  
As a user, I want a “My Favorites” screen so that I can view and manage all my saved items in one place.  

**Acceptance Criteria:**  
- Show all saved items in a list/grid.  
- Each item displays **title, category, and duration**.  
- Tapping an item opens its details or starts it.  
- Favorites list persists across sessions.  

**Story Points:** 5  

---

## ⏰ Daily Reminders  

### User Story 1 – Calendar Navigation  
**Title:**  
As a user, I want to view the calendar for the current month and navigate between months so that I can easily select dates for reminders.  

**Acceptance Criteria:**  
- Show current month with all days visible.  
- Provide arrows to navigate between months.  
- Default text: **“Selected Date: None”** and **“Selected Time: 20:44”** until selected.  

**Story Points:** 5  

---

### User Story 2 – Select Date and Time  
**Title:**  
As a user, I want to select a date and time for a reminder so that I can schedule it properly.  

**Acceptance Criteria:**  
- User can pick a date from calendar.  
- User can select a time from time picker.  
- Selected values replace default text.  
- System validates selection before saving.  

**Story Points:** 5  

---

### User Story 3 – Add Reminder  
**Title:**  
As a user, I want to add a reminder after selecting a time so that I can schedule it for a future date and time.  

**Acceptance Criteria:**  
- After choosing valid date & time, user taps **“Add Reminder”**.  
- Reminder is saved and added to list.  
- Confirmation message appears.  

**Story Points:** 3  

---

### User Story 4 – Manage Reminders  
**Title:**  
As a user, I want to see a list of all my reminders so that I can manage them easily.  

**Acceptance Criteria:**  
- Display list of reminders with date + time.  
- Each reminder has red **“Delete”** button.  
- Deleting removes item from list.  
- Changes persist across sessions.  

**Story Points:** 5  

---

## 📤 Sharing Exercises  

### User Story – Share Exercises  
**Title:**  
As a user, I want to easily share recommended exercises with friends or family so that I can help others discover helpful activities.  

**Acceptance Criteria:**  
- Clear **share button/icon** on exercise detail page.  
- Tapping opens device’s native share options (social, email, messaging).  
- Shared content includes **title, category, and link/preview**.  
- If sharing fails, user sees error message.  

**Story Points:** 5  

---

## 🚪 Logout  

### User Story – Logout  
**Title:**  
As a user, I want a clear and visible logout button so that I can easily log out of my account when I’m done using the app.  

**Acceptance Criteria:**  
- Display **Logout** button (e.g., in Settings/Profile).  
- Tapping ends session and redirects to **Login** page.  
- All session data is securely cleared.  
- Restricted pages prompt login after logout.  

**Story Points:** 3  

---

## ⚙️ Change Settings (Theme)  

### User Story – Theme Toggle  
**Title:**  
As a user, I want to switch between light and dark themes so that I can reduce eye strain and customize the app’s visual experience.  

**Acceptance Criteria:**  
- **Theme toggle** in Settings for Light/Dark mode.  
- Switching themes is seamless.  
- Theme applies immediately without restart.  
- User preference persists across sessions.  

**Story Points:** 5  
