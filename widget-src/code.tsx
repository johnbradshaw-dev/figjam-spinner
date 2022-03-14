const { widget } = figma;
const {
  AutoLayout,
  waitForTask,
  Text,
  useSyncedState,
  useEffect,
  useSyncedMap,
  Image,
  Rectangle,
  Ellipse,
} = widget;

type SpinnerUser = {
  color: string;
  id: string | null;
  name: string | null;
  selected: boolean;
  photoUrl: string | null;
};

function UserBadge(props: {
  user: SpinnerUser;
  selected: boolean;
  showRemove: boolean;
  scale: number;
  removeClick: () => void;
}) {
  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="center"
      width="fill-parent"
      padding={4 * props.scale}
      fill={props.selected ? "#ff00b1" : "#FFFFFF"}
      cornerRadius={8 * props.scale}
      spacing={6 * props.scale}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 0, y: 0 },
        blur: 2 * props.scale,
        spread: 2 * props.scale,
      }}
    >
      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="start"
        width="fill-parent"
        padding={5}
        fill="#E6E6E6"
        cornerRadius={8}
      >
        {props.user.photoUrl ? (
          <Image
            cornerRadius={6 * props.scale}
            width={30 * props.scale}
            height={30 * props.scale}
            src={props.user.photoUrl}
          />
        ) : (
          <Rectangle
            cornerRadius={6 * props.scale}
            width={30 * props.scale}
            height={30 * props.scale}
            fill={props.user.color}
          />
        )}
        <AutoLayout
          direction="horizontal"
          horizontalAlignItems="center"
          width="fill-parent"
          padding={4 * props.scale}
        >
          <Text fontSize={16 * props.scale}>{props.user.name}</Text>
        </AutoLayout>
        <AutoLayout
          direction="horizontal"
          horizontalAlignItems="end"
          padding={4 * props.scale}
          onClick={props.showRemove ? props.removeClick : undefined}
        >
          <Text
            fill={props.showRemove ? "#000" : "#ccc"}
            fontSize={16 * props.scale}
          >
            X
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

function Widget() {
  const names = useSyncedMap<SpinnerUser>("names");

  const initialise = () => {
    const newNames = [
      ...figma.activeUsers.map((a) => ({ ...a, selected: false })),
    ];
    names.values().forEach((n) => {
      names.delete(n.name || "");
    });
    newNames.forEach((n) => {
      names.set(n.name || "", n);
    });
    setSpinning(false);
    setWinner(null);
  };
  useEffect(() => {
    figma.ui.onmessage = ({ contents }) => {
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      names.set(contents, {
        name: contents,
        color: `#${randomColor}`,
        id: (Math.random() * Math.random()).toString(),
        selected: false,
        photoUrl: null,
      });
    };
    if (figma.activeUsers.length == 0) {
      return;
    }
    if (names.size == 0) {
      initialise();
    }
  });

  const [spinning, setSpinning] = useSyncedState<boolean>("spinning", false);
  const [winner, setWinner] = useSyncedState<SpinnerUser | null>(
    "winner",
    null
  );
  const [scale, setScale] = useSyncedState<number>("scale", 1.0);

  const reset = () => {
    initialise();
  };
  function addSomeone() {
    figma.showUI(`
      <h3></h3>
      <input id="editor"/>
      <button id="button">add</button>
      <script>
        const editor = document.getElementById("editor");
        const button = document.getElementById("button");
        button.addEventListener("click", () => {
          parent.postMessage({
            pluginMessage: {
              contents: editor.value
            },
          }, '*');
        })
        editor.focus();
      </script>
    `);
  }

  const spin = () => {
    if (spinning === true) {
      return;
    }
    setSpinning(true);

    const interval = setInterval(() => {
      const newNames = names.values().map((n) => ({ ...n, selected: false }));
      const randomIndex = Math.floor(Math.random() * names.size);
      newNames[randomIndex].selected = true;
      newNames.forEach((n) => {
        names.set(n.name || "", n);
      });
      setWinner(newNames[randomIndex]);
    }, 10 - Math.floor(Math.random() * 5));

    waitForTask(
      new Promise((resolve) => {
        setTimeout(() => {
          setSpinning(false);
          clearInterval(interval);
          resolve(true);
        }, 2000);
      })
    );
  };

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      width={300 * scale}
      padding={8 * scale}
      fill="#FFFFFF"
      cornerRadius={8 * scale}
      spacing={12 * scale}
      stroke={{ r: 0, g: 0, b: 0, a: 0.2 }}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 5 * scale, y: 5 * scale },
        blur: 2 * scale,
        spread: 2 * scale,
      }}
    >
      <Text
        width="fill-parent"
        horizontalAlignText="center"
        onClick={() => spin()}
        fontSize={24 * scale}
      >
        Spinner
      </Text>
      {names.values().map((a) => (
        <AutoLayout
          direction="horizontal"
          width="fill-parent"
          spacing={8 * scale}
          padding={5 * scale}
          verticalAlignItems="center"
          key={a.name || "null"}
        >
          <UserBadge
            scale={scale}
            user={a}
            selected={a.selected}
            showRemove={!spinning}
            removeClick={() => {
              a.name ? names.delete(a.name) : undefined;
            }}
          />
        </AutoLayout>
      ))}
      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="center"
        width="fill-parent"
        height="hug-contents"
        padding={4 * scale}
      >
        {winner && !spinning ? (
          <Text
            width="fill-parent"
            fill={winner?.color || "#000"}
            horizontalAlignText="center"
            fontSize={40 * scale}
          >
            It's {winner ? winner.name : ""}'s turn!
          </Text>
        ) : (
          <Text
            width="fill-parent"
            fill={winner?.color || "#000"}
            horizontalAlignText="center"
          ></Text>
        )}
      </AutoLayout>
      <Text
        fontSize={32 * scale}
        horizontalAlignText="center"
        onClick={() => spin()}
      >
        Spin!
      </Text>
      <Text
        fontSize={24 * scale}
        horizontalAlignText="center"
        onClick={() => {
          reset();
        }}
      >
        Reset
      </Text>
      <Text
        fontSize={16 * scale}
        horizontalAlignText="center"
        onClick={() => {
          addSomeone();
          return new Promise<void>(() => {});
        }}
      >
        Add someone who's not here
      </Text>

      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="center"
        width="fill-parent"
        padding={5 * scale}
        cornerRadius={8 * scale}
      >
        <Text
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          horizontalAlignText="center"
          width={42 * scale}
          onClick={() => {
            addSomeone();
            return new Promise<void>(() => {});
          }}
        >
          Scale:
        </Text>
        <AutoLayout
          onClick={() =>
            scale > 0
              ? setScale(parseFloat((scale - 0.1).toFixed(1)))
              : undefined
          }
          fill="#E6E6E6"
          padding={14 * scale}
          height={28 * scale}
          width={28 * scale}
          cornerRadius={16 * scale}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <Text fontSize={12 * scale} horizontalAlignText="center">
            -
          </Text>
        </AutoLayout>
        <Text
          horizontalAlignText="center"
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          width={24 * scale}
        >
          {scale}
        </Text>
        <AutoLayout
          onClick={() => setScale(parseFloat((scale + 0.1).toFixed(1)))}
          fill="#E6E6E6"
          padding={14 * scale}
          height={28 * scale}
          width={28 * scale}
          cornerRadius={16 * scale}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <Text fontSize={12 * scale} horizontalAlignText="center">
            +
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Widget);
