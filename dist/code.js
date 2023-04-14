"use strict";
(() => {
  // lib/formatHEX.ts
  var formatHEX = (hex) => {
    if (hex[0] !== "#") {
      hex = "#" + hex;
    }
    if (hex.length < 4) {
      hex = hex + 0 * (4 - hex.length);
    }
    if (hex.length == 4) {
      return ("#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]).toUpperCase();
    }
    if (hex.length < 7) {
      hex += 0 * (7 - hex.length);
    }
    return hex.slice(0, 7).toUpperCase();
  };

  // lib/HEXToRGB.ts
  var HEXToRGB = (hex) => {
    if (hex.length !== 7) {
      return { r: 0, g: 0, b: 0 };
    } else {
      const R = parseInt(hex[1] + hex[2], 16);
      const G = parseInt(hex[3] + hex[4], 16);
      const B = parseInt(hex[5] + hex[6], 16);
      return { r: R, g: G, b: B };
    }
  };

  // lib/RGBToHEX.ts
  var RGBToHEX = (R, G, B) => {
    const hR = (R < 16 ? "0" + R.toString(16) : R.toString(16)).toUpperCase();
    const hG = (G < 16 ? "0" + G.toString(16) : G.toString(16)).toUpperCase();
    const hB = (B < 16 ? "0" + B.toString(16) : B.toString(16)).toUpperCase();
    return "#" + hR + hG + hB;
  };

  // lib/RGBToCMYK.ts
  var RGBToCMYK = (r, g, b) => {
    r = r / 255 * 100;
    g = g / 255 * 100;
    b = b / 255 * 100;
    let K = 100 - Math.max(r, g, b);
    const C = K == 100 ? 0 : Math.floor((100 - r - K) / (100 - K) * 100);
    const M = K == 100 ? 0 : Math.floor((100 - g - K) / (100 - K) * 100);
    const Y = K == 100 ? 0 : Math.floor((100 - b - K) / (100 - K) * 100);
    K = Math.floor(K);
    return { C, M, Y, K };
  };

  // widget-src/code.tsx
  var { widget } = figma;
  var { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useEffect } = widget;
  function Widget() {
    const widgetId = widget.useWidgetId();
    const [name, setName] = useSyncedState("name", "ColorName");
    const [CMYK, setCMYK] = useSyncedState("cmyk", { C: 0, M: 0, Y: 0, K: 0 });
    const [RGB, setRGB] = useSyncedState("rgb", { r: 255, g: 255, b: 255 });
    const [HEX, setHEX] = useSyncedState("hex", "FFFFFF");
    const [load, setLoad] = useSyncedState("load", true);
    const [color, setColor] = useSyncedState("color", "#000");
    const [textStyles, setTextStyles] = useSyncedState("textStyles", []);
    const [selectedFont, setSelectedFont] = useSyncedState("selectedFont", "default");
    const [fontOptions, setFontOptions] = useSyncedState("fontOptions", [{ option: "default", label: "Default" }]);
    const [textStyle, setTextStyle] = useSyncedState("textStyle", void 0);
    usePropertyMenu([
      {
        itemType: "action",
        tooltip: "Load styles",
        propertyName: "LoadLocalTextStyles"
      },
      {
        itemType: "dropdown",
        propertyName: "fonts",
        tooltip: "Font selector",
        selectedOption: selectedFont,
        options: fontOptions
      },
      {
        itemType: "color-selector",
        propertyName: "colors",
        tooltip: "Color selector",
        selectedOption: color,
        options: [{ option: "#000", tooltip: "Black" }, { option: "#FFF", tooltip: "White" }]
      }
    ], ({ propertyName, propertyValue }) => {
      if (propertyName === "LoadLocalTextStyles") {
        const txtStyles = figma.getLocalTextStyles();
        setTextStyles(txtStyles);
        const loadedOptions = [{ option: "default", label: "Default" }];
        for (const style of txtStyles) {
          loadedOptions.push({ option: style.name, label: style.name });
        }
        setFontOptions(loadedOptions);
      }
      if (propertyName === "fonts") {
        if (propertyValue !== "default" && propertyValue) {
          setSelectedFont(propertyValue);
          alert("comming soon...");
        }
      }
      if (propertyName === "colors" && propertyValue) {
        setColor(propertyValue);
      }
    });
    useEffect(() => {
      const currentWidget = figma.getNodeById(widgetId);
      let frameId = currentWidget.parent ? currentWidget.parent.id : "";
      if (load) {
        setLoad(false);
        const frame = figma.createFrame();
        frame.x = currentWidget.x;
        frame.y = currentWidget.y;
        currentWidget.x = 0;
        currentWidget.y = 0;
        frame.resize(400, 400);
        frame.appendChild(currentWidget);
        figma.currentPage.appendChild(frame);
        frameId = frame.id;
      }
      if (frameId !== "") {
        const frame = figma.getNodeById(frameId);
        frame.fills = [{ type: "SOLID", color: { r: RGB.r / 255, g: RGB.g / 255, b: RGB.b / 255 } }];
      }
    });
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        name: "ColorCodeManager",
        direction: "vertical",
        spacing: 5,
        padding: 20,
        width: 260,
        height: 212
      },
      /* @__PURE__ */ figma.widget.h(
        Input,
        {
          name: "Name",
          fill: color,
          value: name,
          placeholder: "Name",
          inputBehavior: "wrap",
          fontFamily: textStyle ? textStyle.fontName.family : "Inter",
          fontSize: textStyle ? textStyle.fontSize : 18,
          verticalAlignText: "center",
          onTextEditEnd: (e) => {
            setName(e.characters);
          }
        }
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "CMYK",
          spacing: 0
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LableC",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "C:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueC",
            fill: color,
            width: 35,
            value: String(CMYK.C),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = CMYK;
              newCol.C = Number(e.characters);
              setCMYK(newCol);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelM",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "M:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueM",
            fill: color,
            width: 35,
            value: String(CMYK.M),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = CMYK;
              newCol.M = Number(e.characters);
              setCMYK(newCol);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelY",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "Y:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueY",
            fill: color,
            width: 35,
            value: String(CMYK.Y),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = CMYK;
              newCol.Y = Number(e.characters);
              setCMYK(newCol);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelK",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "K:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueK",
            fill: color,
            width: 35,
            value: String(CMYK.K),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = CMYK;
              newCol.K = Number(e.characters);
              setCMYK(newCol);
            }
          }
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "RGB",
          spacing: 5
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelR",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "R:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueR",
            fill: color,
            width: 35,
            value: String(RGB.r),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = RGB;
              newCol.r = Number(e.characters);
              const HEX2 = RGBToHEX(newCol.r, newCol.g, newCol.b);
              const CMYK2 = RGBToCMYK(newCol.r, newCol.g, newCol.b);
              setHEX(HEX2.slice(1, 7));
              setCMYK(CMYK2);
              setRGB(newCol);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelG",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "G:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueG",
            fill: color,
            width: 35,
            value: String(RGB.g),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = RGB;
              newCol.g = Number(e.characters);
              const HEX2 = RGBToHEX(newCol.r, newCol.g, newCol.b);
              const CMYK2 = RGBToCMYK(newCol.r, newCol.g, newCol.b);
              setHEX(HEX2.slice(1, 7));
              setCMYK(CMYK2);
              setRGB(newCol);
            }
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "LabelB",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "B:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "ValueB",
            fill: color,
            width: 35,
            value: String(RGB.b),
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const newCol = RGB;
              newCol.b = Number(e.characters);
              const HEX2 = RGBToHEX(newCol.r, newCol.g, newCol.b);
              const CMYK2 = RGBToCMYK(newCol.r, newCol.g, newCol.b);
              setHEX(HEX2.slice(1, 7));
              setCMYK(CMYK2);
              setRGB(newCol);
            }
          }
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "HEX",
          spacing: 5
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "Label",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "HEX:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            name: "Value",
            fill: color,
            width: 100,
            value: HEX,
            inputBehavior: "wrap",
            fontFamily: "Inter",
            fontSize: 18,
            verticalAlignText: "center",
            onTextEditEnd: (e) => {
              const formattedHEX = formatHEX(e.characters);
              const RGB2 = HEXToRGB(formattedHEX);
              setHEX(formattedHEX.slice(1, 7));
              const CMYK2 = RGBToCMYK(RGB2.r, RGB2.g, RGB2.b);
              setRGB(RGB2);
              setCMYK(CMYK2);
            }
          }
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "Pantone",
          spacing: 5
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "Label",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "Pantone:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "Value",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "---"
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "DIC",
          spacing: 5
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "Label",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "DIC:"
        ),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            name: "Value",
            fill: color,
            fontFamily: "Inter",
            fontSize: 18
          },
          "---"
        )
      )
    );
  }
  widget.register(Widget);
})();
