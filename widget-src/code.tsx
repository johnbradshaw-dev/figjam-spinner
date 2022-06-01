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
  nickName: string | null;
  selected: boolean;
  photoUrl: string | null;
};

function UserBadge(props: {
  user: SpinnerUser;
  selected: boolean;
  showRemove: boolean;
  scale: number;
  isDarkMode: boolean;
  nicknames: boolean;
  removeClick: () => void;
}) {
  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="center"
      width="fill-parent"
      padding={4 * props.scale}
      fill={
        props.selected ? "#ff00b1" : props.isDarkMode ? "#525252" : "#FFFFFF"
      }
      cornerRadius={8 * props.scale}
      spacing={6 * props.scale}
      effect={{
        type: "drop-shadow",
        color: props.isDarkMode ? "#FFFFFF" : "#525252",
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
        fill={props.isDarkMode ? "#878787" : "#E6E6E6"}
        cornerRadius={8 * props.scale}
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
          <Text
            fill={props.isDarkMode ? "#FFFFFF" : "#000"}
            fontSize={16 * props.scale}
          >
            {props.nicknames
              ? insertNickName(props.user.name, props.user.nickName)
              : props.user.name}
          </Text>
        </AutoLayout>
        <AutoLayout
          direction="horizontal"
          horizontalAlignItems="end"
          padding={4 * props.scale}
          onClick={props.showRemove ? props.removeClick : undefined}
        >
          <Text
            fill={
              props.showRemove
                ? props.isDarkMode
                  ? "#FFFFFF"
                  : "#000"
                : "#ccc"
            }
            fontSize={16 * props.scale}
          >
            x
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
function insertNickName(name: string | null, nickName: string | null) {
  var nameParts = (name || "").split(" ");
  return `${nameParts[0]} ${nameParts.length == 1 ? " AKA" : ""} "${nickName}"${
    nameParts.length > 1 ? ` ${nameParts.slice(1).join(" ")}` : ""
  }`;
}
function getRandomNickName() {
  return nickNames[Math.floor(Math.random() * nickNames.length - 1)];
}
const nickNames = [
  "Aspect",
  "Kraken",
  "Bender",
  "Lynch",
  "Big Papa",
  "Mad Dog",
  "Bowser",
  "O'Doyle",
  "Bruise",
  "Psycho",
  "Cannon",
  "Ranger",
  "Clink",
  "Ratchet",
  "Cobra",
  "Reaper",
  "Colt",
  "Rigs",
  "Crank",
  "Ripley",
  "Creep",
  "Roadkill",
  "Daemon",
  "Ronin",
  "Decay",
  "Rubble",
  "Diablo",
  "Sasquatch",
  "Doom",
  "Scar",
  "Dracula",
  "Shiver",
  "Dragon",
  "Skinner",
  "Fender",
  "Skull Crusher",
  "Fester",
  "Slasher",
  "Fisheye",
  "Steelshot",
  "Flack",
  "Surge",
  "Gargoyle",
  "Sythe",
  "Grave",
  "Trip",
  "Gunner",
  "Trooper",
  "Hash",
  "Tweek",
  "Hashtag",
  "Vein",
  "Indominus",
  "Void",
  "Ironclad",
  "Wardon",
  "Killer",
  "Wraith",
  "Knuckles",
  "Zero",
  "Steel",
  "Kevlar",
  "Lightning",
  "Tito",
  "Bullet-Proof",
  "Fire-Bred",
  "Titanium",
  "Hurricane",
  "Ironsides",
  "Iron-Cut",
  "Tempest",
  "Iron Heart",
  "Steel Forge",
  "Pursuit",
  "Steel Foil",
  "Sick Rebellious Names",
  "Upsurge",
  "Uprising",
  "Overthrow",
  "Breaker",
  "Sabotage",
  "Dissent",
  "Subversion",
  "Rebellion",
  "Insurgent",
  "Accidental Genius",
  "Acid Gosling",
  "Admiral Tot",
  "AgentHercules",
  "Airport Hobo",
  "Alley Frog",
  "Alpha",
  "AlphaReturns",
  "Angel",
  "AngelsCreed",
  "Arsenic Coo",
  "Atomic Blastoid",
  "Automatic Slicer",
  "Baby Brown",
  "Back Bett",
  "Bad Bunny",
  "Bazooka Har-de-har",
  "Bearded Angler",
  "Beetle King",
  "Betty Cricket",
  "Bit Sentinel",
  "Bitmap",
  "BlacKitten",
  "Blister",
  "Blistered Outlaw",
  "Blitz",
  "BloodEater",
  "Bonzai",
  "BoomBeachLuvr",
  "BoomBlaster",
  "Bootleg Taximan",
  "Bowie",
  "Bowler",
  "Breadmaker",
  "Broomspun",
  "Buckshot",
  "Bug Blitz",
  "Bug Fire",
  "Bugger",
  "Cabbie",
  "Candy Butcher",
  "Capital F",
  "Captain Peroxide",
  "Celtic Charger",
  "Centurion Sherman",
  "Cereal Killer",
  "Chasm Face",
  "Chew Chew",
  "Chicago Blackout",
  "Ballistic",
  "Furore",
  "Uproar",
  "Fury",
  "Ire",
  "Demented",
  "Wrath",
  "Madness",
  "Schizo",
  "Rage",
  "Savage",
  "Manic",
  "Frenzy",
  "Mania",
  "Derange",
  "CobraBite",
  "Cocktail",
  "CollaterolDamage",
  "CommandX",
  "Commando",
  "Congo Wire",
  "Cool Iris",
  "Cool Whip",
  "Cosmo",
  "Crash Override",
  "Crash Test",
  "Crazy Eights",
  "Criss Cross",
  "Cross Thread",
  "Cujo",
  "Cupid Dust",
  "Daffy Girl",
  "Dahlia Bumble",
  "DaisyCraft",
  "Dancing Madman",
  "Dangle",
  "DanimalDaze",
  "Dark Horse",
  "Darkside Orbit",
  "Darling Peacock",
  "Day Hawk",
  "Desert Haze",
  "Desperado",
  "Devil Blade",
  "Devil Chick",
  "Dexter",
  "Diamond Gamer",
  "Digger",
  "Disco Potato",
  "Disco Thunder",
  "DiscoMate",
  "Don Stab",
  "Doz Killer",
  "Dredd",
  "DriftDetector",
  "DriftManiac",
  "Drop Stone",
  "Dropkick",
  "Drugstore Cowboy",
  "DuckDuck",
  "Earl of Arms",
  "Easy Sweep",
  "Eerie Mizzen",
  "ElactixNova",
  "Elder Pogue",
  "Electric Player",
  "Electric Saturn",
  "Ember Rope",
  "Esquire",
  "ExoticAlpha",
  "EyeShooter",
  "Fabulous",
  "Fast Draw",
  "FastLane",
  "Father Abbot",
  "FenderBoyXXX",
  "Fennel Dove",
  "Feral Mayhem",
  "Fiend Oblivion",
  "FifthHarmony",
  "Fire Feline",
  "Fire Fish",
  "FireByMisFire",
  "Fist Wizard",
  "Atilla",
  "Darko",
  "Terminator",
  "Conqueror",
  "Mad Max",
  "Siddhartha",
  "Suleiman",
  "Billy the Butcher",
  "Thor",
  "Napoleon",
  "Maximus",
  "Khan",
  "Geronimo",
  "Leon",
  "Leonidas",
  "Dutch",
  "Cyrus",
  "Hannibal",
  "Dux",
  "Mr. Blonde",
  "Agrippa",
  "Jesse James",
  "Matrix",
  "Bleed",
  "X-Skull",
  "Gut",
  "Nail",
  "Jawbone",
  "Socket",
  "Fist",
  "Skeleton",
  "Footslam",
  "Tooth",
  "Craniax",
  "Head-Knocker",
  "K-9",
  "Bone",
  "Razor",
  "Kneecap",
  "Cut",
  "Slaughter",
  "Soleus",
  "Gash",
  "Scalp",
  "Blood",
  "Scab",
  "Torque",
  "Torpedo",
  "Wildcat",
  "Automatic",
  "Cannon",
  "Hellcat",
  "Glock",
  "Mortar",
  "Tomcat",
  "Sniper",
  "Siege",
  "Panther",
  "Carbine",
  "Bullet",
  "Jaguar",
  "Javelin",
  "Aero",
  "Bomber",
  "Howitzer",
  "Albatross",
  "Strike Eagle",
  "Gatling",
  "Arsenal",
  "Rimfire",
  "Avenger",
  "Hornet",
  "Centerfire",
  "Hazzard",
  "Grizzly",
  "Wolverine",
  "Deathstalker",
  "Snake",
  "Wolf",
  "Scorpion",
  "Vulture",
  "Claw",
  "Boomslang",
  "Falcon",
  "Fang",
  "Viper",
  "Ram",
  "Grip",
  "Sting",
  "Boar",
  "Black Mamba",
  "Lash",
  "Tusk",
  "Goshawk",
  "Gnaw",
  "Polar Bee",
  "Poppy Coffee",
  "Poptart AK47",
  "Prometheus",
  "Psycho Thinker",
  "Pusher",
  "Racy Lion",
  "RadioactiveMan",
  "Raid Bucker",
  "Rando Tank",
  "Ranger",
  "Red Combat",
  "Red Rhino",
  "RedFeet",
  "RedFisher",
  "RedMouth",
  "Reed Lady",
  "Renegade Slugger",
  "Reno Monarch",
  "Returns",
  "RevengeOfOmega",
  "Riff Raff",
  "Roadblock",
  "RoarSweetie",
  "Rocky Highway",
  "Roller Turtle",
  "Romance Guppy",
  "Rooster",
  "Rude Sniper",
  "Saint La-Z-Boy",
  "Sandbox",
  "Scare Stone",
  "ScaryNinja",
  "ScaryPumpkin",
  "Scrapper",
  "Scrapple",
  "Screw",
  "Screwtape",
  "Seal Snake",
  "Shadow Bishop",
  "Shadow Chaser",
  "Sherwood Gladiator",
  "Shooter",
  "ShowMeSunset",
  "ShowMeUrguts",
  "Sidewalk Enforcer",
  "Sienna Princess",
  "Silver Stone",
  "Sir Shove",
  "Skull Crusher",
  "Sky Bully",
  "Sky Herald",
];

function Widget() {
  const names = useSyncedMap<SpinnerUser>("names");

  const initialise = () => {
    const newNames = [
      ...figma.activeUsers.map((a) => ({
        ...a,
        selected: false,
        nickName: getRandomNickName(),
      })),
    ];
    names.values().forEach((n) => {
      names.delete(n.name || "");
    });
    newNames.forEach((n) => {
      names.set(n.name || "", n);
    });
    setWidth(calculateWidth());
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
        nickName: getRandomNickName(),
        photoUrl: null,
      });
      setWidth(calculateWidth());
    };
    if (figma.activeUsers.length == 0) {
      return;
    }
    if (names.size == 0) {
      initialise();
    }
  });
  const [isDarkMode, setDarkMode] = useSyncedState<boolean>("darkMode", false);
  const [spinning, setSpinning] = useSyncedState<boolean>("spinning", false);
  const [nickNamesEnabled, setNickNames] = useSyncedState<boolean>(
    "nicknames",
    false
  );
  const [winner, setWinner] = useSyncedState<SpinnerUser | null>(
    "winner",
    null
  );
  const [scale, setScale] = useSyncedState<number>("scale", 1.0);
  const [width, setWidth] = useSyncedState<number>("width", 0);
  const calculateWidth = (nickNames = nickNamesEnabled) =>
    Math.max(
      ...names
        .values()
        .map(
          (n) =>
            (nickNames ? insertNickName(n.name, n.nickName) : n.name || "")
              .length || 0
        )
    ) * 15;
  const reset = () => {
    initialise();
  };
  const nickNamesClick = () => {
    setNickNames(!nickNamesEnabled);
    setWidth(calculateWidth(!nickNamesEnabled));
  };
  const darkMode = () => {
    setDarkMode(!isDarkMode);
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
      width={Math.max(width, 300) * scale}
      padding={8 * scale}
      fill={isDarkMode ? "#525252" : "#FFFFFF"}
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
      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        width="fill-parent"
        padding={scale}
        cornerRadius={8 * scale}
      >
        <Text
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          horizontalAlignText="center"
          width={42 * scale}
          fill={isDarkMode ? "#FFFFFF" : "#000"}
        >
          🔎
        </Text>
        <AutoLayout
          onClick={() =>
            scale > 0.5
              ? setScale(parseFloat((scale - 0.5).toFixed(1)))
              : undefined
          }
          fill={isDarkMode ? "#878787" : "#E6E6E6"}
          padding={14 * scale}
          height={20 * scale}
          width={20 * scale}
          cornerRadius={16 * scale}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <Text
            fill={isDarkMode ? "#FFF" : "#000"}
            fontSize={12 * scale}
            horizontalAlignText="center"
          >
            -
          </Text>
        </AutoLayout>
        <Text
          fill={isDarkMode ? "#FFF" : "#000"}
          horizontalAlignText="center"
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          width={24 * scale}
        >
          {scale}
        </Text>
        <AutoLayout
          onClick={() => setScale(parseFloat((scale + 0.5).toFixed(1)))}
          fill={isDarkMode ? "#878787" : "#E6E6E6"}
          padding={14 * scale}
          height={20 * scale}
          width={20 * scale}
          cornerRadius={16 * scale}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <Text
            fill={isDarkMode ? "#FFF" : "#000"}
            fontSize={12 * scale}
            horizontalAlignText="center"
          >
            +
          </Text>
        </AutoLayout>
        <Text
          width="fill-parent"
          horizontalAlignText="center"
          onClick={() => spin()}
          fontSize={24 * scale}
          fill={isDarkMode ? "#FFFFFF" : "#000"}
        >
          Spinner
        </Text>
        <Text
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          horizontalAlignText="center"
          width={42 * scale}
          onClick={() => darkMode()}
        >
          {isDarkMode ? "🔆" : "🌙"}
        </Text>
        <Text
          height={"fill-parent"}
          verticalAlignText="center"
          fontSize={12 * scale}
          horizontalAlignText="center"
          width={42 * scale}
          onClick={() => nickNamesClick()}
        >
          {!nickNamesEnabled ? "🥚" : "🐣"}
        </Text>
      </AutoLayout>

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
            nicknames={nickNamesEnabled}
            showRemove={!spinning}
            removeClick={() => {
              a.name ? names.delete(a.name) : undefined;
            }}
            isDarkMode={isDarkMode}
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
            fill={winner?.color || (isDarkMode ? "#FFFFFF" : "#000")}
            horizontalAlignText="center"
            fontSize={30 * scale}
          >
            It's{" "}
            {winner ? (nickNamesEnabled ? winner.name : winner.nickName) : ""}'s
            turn!
          </Text>
        ) : (
          <Text
            width="fill-parent"
            fill={winner?.color || (isDarkMode ? "#FFFFFF" : "#000")}
            horizontalAlignText="center"
          ></Text>
        )}
      </AutoLayout>
      <Text
        fill={isDarkMode ? "#FFFFFF" : "#000"}
        fontSize={32 * scale}
        horizontalAlignText="center"
        onClick={() => spin()}
      >
        Spin!
      </Text>
      <Text
        fill={isDarkMode ? "#FFFFFF" : "#000"}
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
        fill={isDarkMode ? "#FFFFFF" : "#000"}
        onClick={() => {
          addSomeone();
          return new Promise<void>(() => {});
        }}
      >
        Add someone who's not here
      </Text>
    </AutoLayout>
  );
}
widget.register(Widget);
