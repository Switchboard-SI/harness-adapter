import { Composition } from "remotion";

export const Composition = () => {
  return (
    <Composition
      id="harness-adapter-intro"
      component={Intro}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

const Intro = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#050608" }}>
      <h1 style={{ color: "#8b5cf6" }}>@switchboard/harness-adapter</h1>
    </div>
  );
};
