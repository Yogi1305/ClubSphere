import { Helmet } from "react-helmet";

const QuizzySEO = () => {
  return (
    <Helmet>
      {/* Title */}
      <title>ClubSphere - Create Quizzes, Polls & Contests with Prizes at Low Cost</title>

      {/* Meta description */}
      <meta
        name="description"
        content="Clubsphere lets you easily create engaging quizzes, polls, and contests with exciting prizes – all at the lowest cost. Join now and make learning fun!"
      />

      {/* Canonical */}
      <link rel="canonical" href="https://theclubsphere.vercel.app" />

      {/* Open Graph */}
      <meta property="og:title" content="Clubsphere - Affordable Quizzes, Polls & Contests " />
      <meta
        property="og:description"
        content="Host your own quiz contests and polls with ease. Offer prizes and engage your audience for as little as ₹10 per contest!"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://theclubsphere.vercel.app" />
      <meta property="og:image" content="https://theclubsphere.vercel.app" />

      {/* Twitter Card */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Quizzy - Run Quizzes, Polls & Contests with Prizes" />
      <meta
        name="twitter:description"
        content="Affordable quiz and poll platform with prizes. Create contests that engage and reward – starting at just ₹10!"
      />
      <meta name="twitter:image" content="https://www.quizzyapp.com/twitter-card.png" /> */}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Keywords */}
      <meta
        name="keywords"
        content="quiz platform, create quiz, online poll, contest with prize, affordable quiz contests, Clubsphere app, run polls, interactive quizzes, host quiz games"
      />
    </Helmet>
  );
};

export default QuizzySEO;
