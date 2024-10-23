import Footer from "~/components/Footer";
import MazeForm from "~/components/MazeGeneratorForm";
import { pixelifySans, comfortaa } from "./fonts";
import OzobotComponent from "~/components/Ozobot";

export default function HomePage() {
  return (
    <main className="m-8 flex flex-col items-center justify-center gap-10">
      <h1 className={`text-5xl font-semibold ${pixelifySans.className}`}>
        Ozobot Maze Generator
      </h1>
      <OzobotComponent />
      <MazeForm />
      <div className={`max-w-xl text-lg ${comfortaa.className}`}>
        <h2
          className={`mb-5 text-center text-3xl font-semibold ${pixelifySans.className}`}
        >
          Meet the Dev
        </h2>
        <p>
          How fortuitous you have arrived! The name&apos;s{" "}
          <a className="link" href="https://mr-monkey-portfolio.vercel.app/">
            Michael
          </a>{" "}
          and I built this Ozobot Maze Generator! I had the idea when I was
          teaching a &apos;Coding&apos; class while working at Maple Bear
          because many students would finish their Ozobot tasks quite quickly,
          so I wanted to have some fast finisher activities available for them.
          Alas, life got in the way, so I didn&apos;t complete it until I moved
          to Younghoon, but my grade (5th) makes use of it in one module and the
          6th grade team makes use of it during their summer camp!
        </p>
        <p className="pt-8">
          If you find it useful, I humbly request you{" "}
          <a className="link" href="">
            buy me an avocado
          </a>{" "}
          or subscribe to{" "}
          <a className="link" href="">
            my patreon
          </a>
          .
        </p>
        <p className="pt-8">
          If you don&apos;t know what Ozobot is, click{" "}
          <a className="link" href="https://ozobot.com/">
            here
          </a>
          .
        </p>
      </div>
      <Footer />
    </main>
  );
}
