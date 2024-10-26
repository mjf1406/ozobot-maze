import { getI18n } from "locales/server"; // Ensure this function is correctly typed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { pixelifySans } from "~/app/fonts";

const tips = [
  {
    title: "Differentiation",
    desc: "Easily differentiate each activity.",
    content:
      "You can add checkboxes with a pen or pencil to each Color Code. You can also put an X in those you don't want completed.",
  },
  {
    title: "Reading a Grid",
    desc: "Teach your students how to read the grid.",
    content:
      "The Ozobot Challenge comes with a great opportunity to teach your students how to read a grid with coordinates. You could complete the Challenge together by calling out coordinates and a color.",
  },
  {
    title: "Create an Ozobot Maze",
    desc: "Repurpose Ozobot Challenge.",
    content:
      "Instead of having the student complete the Ozobot Challenge, you could have them create an Ozobot Maze using the listed Color Codes and then pass it along to a classmate to try to gather all the stars.",
  },
  {
    title: "",
    desc: "",
    content: "",
  },
];

const Tips = async () => {
  const t = await getI18n();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 py-6">
      <h2
        className={`mb-5 text-center text-3xl font-semibold ${pixelifySans.className}`}
      >
        Tips
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map(
          (tip, index) =>
            tip.title && (
              <Card key={index} className="w-full bg-accent/40">
                <CardHeader>
                  <CardTitle className="text-xl">{tip.title}</CardTitle>
                  <CardDescription>{tip.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </div>
  );
};

export default Tips;
