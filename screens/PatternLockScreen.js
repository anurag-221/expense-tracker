import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, PanResponder } from "react-native";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import * as SecureStore from "expo-secure-store";
import colors from "../theme/colors";

const DOTS = [
  { id: 1, x: 1, y: 1 },
  { id: 2, x: 2, y: 1 },
  { id: 3, x: 3, y: 1 },
  { id: 4, x: 1, y: 2 },
  { id: 5, x: 2, y: 2 },
  { id: 6, x: 3, y: 2 },
  { id: 7, x: 1, y: 3 },
  { id: 8, x: 2, y: 3 },
  { id: 9, x: 3, y: 3 },
];

export default function PatternLockScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [stage, setStage] = useState("set"); // set, confirm, unlock
  const [firstPattern, setFirstPattern] = useState([]);

  const gridRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => detectTouch(gesture),
      onPanResponderRelease: handlePatternEnd,
    })
  ).current;

  function detectTouch(gesture) {
    if (!gridRef.current) return;

    const { pageX, pageY } = gesture;
    DOTS.forEach((dot) => {
      const size = 80;
      const pos = gridRef.current[dot.id];
      if (!pos) return;

      const inside =
        pageX > pos.x - size / 2 &&
        pageX < pos.x + size / 2 &&
        pageY > pos.y - size / 2 &&
        pageY < pos.y + size / 2;

      if (inside && !selected.includes(dot.id)) {
        setSelected((prev) => [...prev, dot.id]);
      }
    });
  }

  async function handlePatternEnd() {
    if (stage === "set") {
      setFirstPattern(selected);
      setSelected([]);
      setStage("confirm");
      return;
    }

    if (stage === "confirm") {
      if (JSON.stringify(selected) === JSON.stringify(firstPattern)) {
        await SecureStore.setItemAsync("pattern", JSON.stringify(selected));
        alert("Pattern Saved!");
        navigation.goBack();
      } else {
        alert("Patterns do not match. Try again.");
      }
      setSelected([]);
      return;
    }

    if (stage === "unlock") {
      const saved = await SecureStore.getItemAsync("pattern");
      if (saved) {
        if (JSON.stringify(selected) === saved) {
          navigation.replace("Home");
        } else {
          alert("Wrong Pattern");
        }
      }
      setSelected([]);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Glass Blur Background */}
      <BlurView intensity={90} tint="dark" style={{ position: "absolute", width: "100%", height: "100%" }} />

      <View className="flex-1 justify-center items-center" {...panResponder.panHandlers}>
        
        {/* Title */}
        <Text className="text-white text-2xl mb-10 font-semibold">
          {stage === "set" && "Set Your Pattern"}
          {stage === "confirm" && "Confirm Pattern"}
          {stage === "unlock" && "Draw Pattern to Unlock"}
        </Text>

        {/* Pattern Grid */}
        <View
          style={{
            width: 300,
            height: 300,
            justifyContent: "space-between",
          }}
        >
          {DOTS.map((dot) => (
            <MotiView
              key={dot.id}
              ref={(ref) => {
                if (ref) {
                  ref.measure((fx, fy, w, h, px, py) => {
                    if (!gridRef.current) gridRef.current = {};
                    gridRef.current[dot.id] = { x: px + w / 2, y: py + h / 2 };
                  });
                }
              }}
              animate={{
                scale: selected.includes(dot.id) ? 1.5 : 1,
                backgroundColor: selected.includes(dot.id)
                  ? "rgba(123, 97, 255, 0.9)"
                  : "rgba(255,255,255,0.25)",
              }}
              transition={{ type: "timing", duration: 200 }}
              style={{
                position: "absolute",
                width: 60,
                height: 60,
                borderRadius: 100,
                top: (dot.y - 1) * 100,
                left: (dot.x - 1) * 100,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.6)",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ))}
        </View>

        {/* Reset button (only in setup mode) */}
        {stage !== "unlock" && (
          <TouchableOpacity onPress={() => setSelected([])} className="mt-10">
            <Text className="text-white/70 underline">Reset Pattern</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
