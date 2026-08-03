````markdown

\# MCQ Study – Project Specification



\## Project Overview



Build a \*\*production-quality, mobile-first MCQ Study Web Application\*\* using \*\*only HTML, CSS, and Vanilla JavaScript\*\*.



The application must be completely \*\*static\*\*, require \*\*no backend\*\*, and be deployable directly to \*\*GitHub Pages\*\* for free.



The purpose is to transform an Excel-based question bank into a beautiful, modern learning experience suitable for both studying and exam practice.



---



\# Core Principles



The application should be:



\- Fast

\- Minimal

\- Elegant

\- Highly responsive

\- Accessible

\- Offline-friendly after first load

\- Easy to maintain

\- Easy to update with new question banks



No frameworks.



No React.



No Vue.



No Angular.



No Bootstrap.



No Tailwind.



No jQuery.



No backend.



No database.



Everything must work entirely inside the browser.



---



\# Technology Stack



\- HTML5

\- CSS3

\- Vanilla JavaScript (ES6+)

\- Local Storage

\- JSON (Question Bank)

\- GitHub Pages



---



\# Project Structure



```

mcq-study/



│── index.html

│── style.css

│── script.js

│── questions.json



│── assets/

│     ├── icon.svg

│     ├── favicon.svg

│     ├── logo.svg (optional)

│     └── illustrations/



│── README.md

```



---



\# Existing Assets



The project already contains:



```

icon.svg

```



Use this file as:



\- Website favicon

\- App logo

\- Splash/loading animation

\- Empty-state illustration where appropriate



Do \*\*not\*\* create another logo unless absolutely necessary.



---



\# Design Language



The UI should feel inspired by:



\- UWorld

\- Amboss

\- Notion

\- Linear

\- Apple Human Interface Guidelines



Avoid:



\- Loud colors

\- Heavy gradients

\- Clutter

\- Cartoonish elements

\- Generic Bootstrap appearance



Aim for:



\- Clean typography

\- Soft shadows

\- Large spacing

\- Rounded corners

\- Excellent readability

\- Calm, distraction-free study environment



---



\# Home Page



The landing page should include:



\- Logo

\- Application name

\- Short description

\- Start Studying button

\- Continue button (if progress exists)



Below the main content, include a subtle builder credit:



> Built: \*\*Abulfathi Dahiru Ahmad\*\*



This should be elegant and understated—not promotional.



Examples:



\- small muted text in the footer

\- subtle signature beneath the hero section

\- minimal opacity



It should feel tasteful rather than attention-seeking.



---



\# Loading Screen



Before the question bank loads:



Display



\- icon.svg

\- subtle rotation or pulse animation

\- loading progress indicator

\- "Loading Question Bank..."



Fade smoothly into the application once loaded.



---



\# Question Data



The website should load:



```

questions.json

```



Each question object contains:



```json

{

&nbsp;   "id":1,

&nbsp;   "question":"...",

&nbsp;   "options":\[

&nbsp;       "...",

&nbsp;       "...",

&nbsp;       "...",

&nbsp;       "..."

&nbsp;   ],

&nbsp;   "answer":"...",

&nbsp;   "explanation":"..."

}

```



No hardcoded questions.



---



\# Study Mode



Display immediately:



\- Question

\- Options

\- Correct Answer

\- Explanation



Navigation:



\- Previous

\- Next

\- Jump



---



\# Practice Mode



Display:



Question



Options



Hide:



\- Answer

\- Explanation



After submission:



\- Highlight correct answer

\- Highlight user's answer

\- Show explanation

\- Display correctness feedback

\- Enable Next



---



\# Navigation



Implement:



\- Previous

\- Next

\- Jump to Question

\- Random Question

\- Shuffle Mode



---



\# Question Palette



A CBT-style navigation panel.



Question states:



\- Not Visited

\- Visited

\- Correct

\- Incorrect

\- Bookmarked



Each question number should be clickable.



---



\# Search



Search instantly by:



\- Question text

\- Explanation



---



\# Filters



Support:



\- All

\- Correct

\- Incorrect

\- Unanswered

\- Bookmarked



---



\# Bookmarks



Allow users to bookmark difficult questions.



Bookmarks should persist using Local Storage.



---



\# Personal Notes



Each question should allow users to save personal notes.



Automatically save locally.



---



\# Progress Tracking



Persist locally:



\- Completed questions

\- Correct answers

\- Incorrect answers

\- Accuracy

\- Current position

\- Theme preference



No login required.



---



\# Statistics Dashboard



Display:



\- Total Questions

\- Attempted

\- Remaining

\- Correct

\- Incorrect

\- Accuracy Percentage

\- Bookmarked Count



Use lightweight vanilla JavaScript charts where appropriate.



---



\# Themes



Provide:



\- Light Mode

\- Dark Mode



Remember the user's preference using Local Storage.



---



\# Keyboard Shortcuts



Desktop users should be able to use:



← Previous



→ Next



1–5 Select Option



Enter Submit



---



\# Mobile Experience



Must work beautifully on:



\- Phones

\- Tablets

\- Desktop



Requirements:



\- Large touch targets

\- Responsive layouts

\- No horizontal scrolling

\- Smooth animations

\- Fast rendering



---



\# Accessibility



Use:



\- Semantic HTML

\- ARIA labels

\- Keyboard navigation

\- High color contrast

\- Focus indicators



---



\# Performance



The application should comfortably support:



\- 5,000+ questions

\- Large explanations

\- Instant navigation



Optimize rendering to avoid unnecessary DOM updates.



---



\# Code Quality



Write code as if it will be maintained for years.



Requirements:



\- Modular architecture

\- Small reusable functions

\- Clear naming

\- Well-commented

\- Minimal global state

\- Separation of concerns

\- Easy to extend



---



\# Deployment



The final application must be deployable directly to GitHub Pages without any build step.



Running the project should require nothing more than opening:



```

index.html

```



or enabling GitHub Pages.



---



\# Development Workflow



Do \*\*NOT\*\* generate the entire project at once.



Develop incrementally.



For every phase:



1\. Explain the objective.

2\. Implement only that phase.

3\. Verify functionality.

4\. Refactor if needed.

5\. Wait before continuing.



Each phase should leave the project in a working state.



---



\# Final Deliverables



\- Fully functional static web application

\- Responsive UI

\- Beautiful modern design

\- JSON-powered question engine

\- Study Mode

\- Practice Mode

\- Search

\- Filters

\- Bookmarks

\- Personal Notes

\- Progress Tracking

\- Statistics Dashboard

\- Light/Dark Themes

\- Keyboard Shortcuts

\- Local Storage persistence

\- GitHub Pages deployment

\- Clean README explaining how to replace `questions.json` with a new Excel export



The finished product should feel like a polished educational platform rather than a simple question viewer: fast, elegant, and intuitive, with every design decision focused on helping learners study efficiently.

````



