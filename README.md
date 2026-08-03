# MCQ Study Web Application

A production-quality, mobile-first MCQ Study Web Application built with **HTML5, Vanilla CSS3, and Vanilla JavaScript (ES6+)**. 

Designed for medical exam preparation (Paediatrics & Clinical Sciences), this application supports 5-option Multiple True/False (MTF) questions with individual True/False option selection, immediate or post-submission explanations, CBT-style question grid navigation, performance analytics, and browser offline persistence via LocalStorage.

---

## 🌟 Key Features

- **Mobile-First & Ultra Fast**: Pure vanilla implementation without heavy external frameworks, node servers, or build steps.
- **Zero-Server Desktop Compatible**: Double-click `index.html` to open directly in any browser offline without needing any local server software.
- **GitHub Pages Ready**: Instant deployment to GitHub Pages for free public access.
- **5-Option True/False Question Engine**: Answer True (T) or False (F) for each individual option (A, B, C, D, E) of every question.
- **Dual Study Modes**:
  - **Study Mode**: Instantly shows correct answers and detailed option-level explanations.
  - **Practice Mode**: Enables candidate test-taking with option selection, submission, and visual correctness feedback (green ✓ / red ✗).
- **CBT Question Palette**: Interactive slide-out grid showing real-time question statuses (*Unvisited*, *Visited*, *Correct*, *Incorrect*, *Bookmarked*).
- **Search & Filters**: Search instantly across all question text and option explanations; filter by status (All, Unanswered, Correct, Incorrect, Bookmarked).
- **Bookmarks & Personal Notes**: Bookmark difficult questions and take personal notes per question (auto-saved locally).
- **Performance Analytics**: Visual statistics modal with SVG accuracy gauge, completion rates, and option accuracy breakdown.
- **Dark & Light Modes**: Sleek theme toggle with persistent user preferences.
- **Keyboard Shortcuts**:
  - `<Left Arrow>` / `A` : Previous Question
  - `<Right Arrow>` / `D` : Next Question
  - `B` : Toggle Bookmark
  - `/` : Quick Search Focus
  - `Enter` : Submit Answer in Practice Mode

---

## 🌐 Public Deployment (GitHub Pages)

To make your MCQ app available to the public online for free:

1. Push this entire repository to your GitHub account.
2. Go to **Settings** -> **Pages** in your GitHub repository.
3. Select **main** branch (or `master`) and click **Save**.
4. GitHub will publish your website at:
   `https://<your-username>.github.io/<repo-name>/`

**No server setup or configuration is required!** GitHub Pages hosts and serves the application automatically for anyone visiting the link on phone, tablet, or PC.

---

## 💻 Local Desktop Usage (Offline)

Simply double-click `index.html` in your file explorer. It opens directly in any web browser without needing Python, Node, or any local server software.

---

## 🔄 Updating Question Banks

To update or replace the question bank:

1. Edit or replace `FINAL_QUESTIONS.json`.
2. Run the conversion script to generate updated data files:
   ```bash
   python convert_questions.py
   ```
3. Commit and push the changes to GitHub.

---

## 📄 Builder Attribution

Built with care by **Abulfathi Dahiru Ahmad**.
