const { widget } = figma;
const { AutoLayout, waitForTask, Text, useSyncedState, useEffect, useSyncedMap } = widget;

type SpinnerUser = {
  color: string,
  id: string | null,
  name: string | null,
  selected: boolean
}

function Widget() {
  const names = useSyncedMap<SpinnerUser>('names')

  const initialise = () => {
    const newNames = [...figma.activeUsers.map(a => ({ ...a, selected: false }))];
    names.values().forEach(n => {
      names.delete(n.name || "")
    });
    newNames.forEach(n => {
      names.set(n.name || "", n)
    });
    setSpinning(false);
    setWinner(null);
  }
  useEffect(() => {
    figma.ui.onmessage = ({ contents }) => {
      names.set(contents, { name: contents, color: "#000", id: (Math.random() * Math.random()).toString(), selected: false })
    }
    if (figma.activeUsers.length == 0)
      return;
    if (names.size == 0) {
      initialise();
    }
  })

  //const [names, setNames] = useSyncedState<SpinnerUser[]>("names", []);
  const [spinning, setSpinning] = useSyncedState<boolean>("spinning", false);
  const [winner, setWinner] = useSyncedState<SpinnerUser | null>("winner", null);

  const reset = () => {
    initialise();
  }
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
    `)
  }

  const spin = () => {
    if (spinning === true) {
      console.log('spinning')
      return;
    }
    setSpinning(true);

    var interval = setInterval(() => {
      const newNames = names.values().map(n => ({ ...n, selected: false }));
      const randomIndex = Math.floor(Math.random() * names.size);
      newNames[randomIndex].selected = true;
      newNames.forEach(n => {
        names.set(n.name || "", n)
      });
      setWinner(newNames[randomIndex])
    }, 5);

    waitForTask(new Promise(resolve => {
      // Simulate async work
      setTimeout(() => {
        console.log("stopped spinning")
        setSpinning(false);
        clearInterval(interval);
        // Resolve the task
        resolve(true);
      }, 2000)
    }));
  }

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={8}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
    >
      {names.values().map(a => <AutoLayout
        direction="horizontal"
        spacing={8}
        padding={5}
        verticalAlignItems="center"
        fill = {a.selected ? "#ff00b1" : "#FFF"}
        key={a.name || "null"}
      >
        <Text fontSize={32} horizontalAlignText="center" fill={a.color}>
          {a.name}
        </Text>{!spinning ? <Text fontSize={15} horizontalAlignText="center" fill="#ff0000" onClick={() => { names.delete(a.name || "") }}>
          x
        </Text> : undefined}</AutoLayout>)}
      {winner && !spinning ? <Text fontSize={50} fill={winner?.color || "#000"} horizontalAlignText="center">
        It's {winner ? winner.name : ""}'s turn!
      </Text> : undefined}
      <Text fontSize={32} horizontalAlignText="center" onClick={() => spin()}>
        Spin!
      </Text>
      <Text fontSize={24} horizontalAlignText="center" onClick={() => {
        reset();
      }}>
        Reset
      </Text>
      <Text fontSize={12} horizontalAlignText="center" onClick={() => {
        addSomeone();
        return new Promise<void>(() => { })
      }}>
        Add someone who's not here
      </Text>
    </AutoLayout>
  );
}
widget.register(Widget);

