const { widget } = figma;
const { AutoLayout, waitForTask, Text, useSyncedState, useEffect, useSyncedMap } = widget;

type SpinnerUser = {
  color: string,
  id: string| null,
  name: string | null,
  selected: boolean
}

function Widget() {
  const names = useSyncedMap<SpinnerUser>('names')
  useEffect(() => {
    figma.ui.onmessage = ({ contents}) => {
      names.set(contents, {name: contents, color: "#000", id: (Math.random()*Math.random()).toString(), selected: false})
    }
  })

  //const [names, setNames] = useSyncedState<SpinnerUser[]>("names", []);
  const [spinning, setSpinning] = useSyncedState<boolean>("spinning", false);
  const [winner, setWinner] = useSyncedState<SpinnerUser | null>("winner", null);

  const reset = () => {
    const newNames = names.values().map(n => ({...n,selected: false}));
    newNames.forEach(n => {
      names.set(n.name || "", n)
    });
    setSpinning(false);
    setWinner(null);
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
      const newNames = names.values().map(n => ({...n,selected: false}));
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

  useEffect(() => {
    if(figma.activeUsers.length == 0)
      return;
    if(names.size == 0)
    {
      const newNames = [...figma.activeUsers.map(a=>({...a, selected: false}))];
      newNames.forEach(n => {
        names.set(n.name || "", n)
      });
    }
  });

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
      {names.values().map(a => <Text key={a.name || "null"} fontSize={32} horizontalAlignText="center" fill={a.color} stroke={a.selected? "#ff00b1" : "#FFF"} strokeWidth={a.selected? 5 : 0}>
        {a.name}
      </Text>)}
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
        return new Promise<void>(() => {})
      }}>
        Add someone who's not here
      </Text>
    </AutoLayout>
  );
}
widget.register(Widget);

