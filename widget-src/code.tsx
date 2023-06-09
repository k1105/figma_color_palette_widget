// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useEffect } = widget

import {formatHEX} from "../lib/formatHEX";
import {HEXToRGB} from "../lib/HEXToRGB";
import {RGBToHEX} from "../lib/RGBToHEX";
import {RGBToCMYK} from "../lib/RGBToCMYK";

function Widget() {
  const widgetId = widget.useWidgetId();
  const [name, setName] = useSyncedState<string>('name', "ColorName");
  const [CMYK, setCMYK] = useSyncedState<{C: number, M: number, Y: number, K: number}>('cmyk', {C: 0, M: 0, Y: 0, K: 0});
  const [RGB, setRGB] = useSyncedState<{r: number, g: number, b: number}>('rgb', {r: 255, g: 255, b: 255});
  const [HEX, setHEX] = useSyncedState<string>('hex', "FFFFFF");
  const [load, setLoad] = useSyncedState<boolean>('load', true);
  const [color, setColor] = useSyncedState("color", "#000");

  const [textStyles, setTextStyles] = useSyncedState<TextStyle[]>("textStyles", []);
  const [selectedFont, setSelectedFont] = useSyncedState<string>("selectedFont", "default");
  const [fontOptions, setFontOptions] = useSyncedState("fontOptions", [{option: "default", label: "Default"}]);
  const [textStyle, setTextStyle] = useSyncedState<TextStyle|undefined>("textStyle", undefined);

  usePropertyMenu([
    {itemType: 'action',
      tooltip: 'Load styles',
    propertyName: 'LoadLocalTextStyles'},
    {
      itemType: 'dropdown',
      propertyName: 'fonts',
      tooltip: 'Font selector',
      selectedOption: selectedFont,
      options: fontOptions,
    },
    {
      itemType: 'color-selector',
      propertyName: 'colors',
      tooltip: 'Color selector',
      selectedOption: color,
      options: [{option: "#000", tooltip: "Black"}, {option: "#FFF", tooltip: "White"} ],
    },
  ], ({propertyName, propertyValue})=>{
    if(propertyName==="LoadLocalTextStyles") {
      const txtStyles = figma.getLocalTextStyles();
      setTextStyles(txtStyles);

      const loadedOptions = [{option: "default", label: "Default"}];
      for(const style of txtStyles) {
        loadedOptions.push({option: style.name, label: style.name});
      }

      setFontOptions(loadedOptions);
    }

    if(propertyName === "fonts") {
      if(propertyValue!=="default" && propertyValue) {
        setSelectedFont(propertyValue);
        //@ts-ignore
        alert("comming soon...");

        // const selectedTextStyle = textStyles.find(function(font){return font.name == propertyValue});
        // setTextStyle(selectedTextStyle);
      }
    }

    if(propertyName === "colors" && propertyValue) {
      setColor(propertyValue);
    }
  })

  useEffect(() => {
    // console.log(widgetId); widget複製したらその度にwidget.useWidgetId()は呼び出されるらしく、widgetIdには複製したwidgetのIDが含まれているらしい
    const currentWidget = figma.getNodeById(widgetId) as WidgetNode; //ので、ここで取得されるのは複製されたwidget
    let frameId :string = currentWidget.parent? currentWidget.parent.id : "";

    if(load) {
      // ロードが完了した時に実行される処理
      // フレームを追加する
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
    if(frameId !== "") {
      const frame = figma.getNodeById(frameId) as FrameNode;
      frame.fills = [{ type: 'SOLID', color: {r: RGB.r/255,g: RGB.g/255, b: RGB.b/255} }];
    }

    })

  return (
    <AutoLayout
      name="ColorCodeManager"
      direction="vertical"
      spacing={5}
      padding={20}
      width={260}
      height={212}
    >
      <Input
        name="Name"
        fill={color}
        value={name}
        placeholder="Name"
        inputBehavior="wrap"
        fontFamily={textStyle? textStyle.fontName.family : "Inter"}
        fontSize={textStyle? textStyle.fontSize : 18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{setName(e.characters)}}
      />
      <AutoLayout
        name="CMYK"
        spacing={0}
      >
        <Text
          name="LableC"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          C:
        </Text>
        <Input
        name="ValueC"
        fill={color}
        width={35}
        value={String(CMYK.C)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = CMYK;
          newCol.C = Number(e.characters);
          setCMYK(newCol);
        }}
        />
        <Text
          name="LabelM"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          M:
        </Text>
        <Input
        name="ValueM"
        fill={color}
        width={35}
        value={String(CMYK.M)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = CMYK;
          newCol.M = Number(e.characters);
          setCMYK(newCol);
        }}
        />
        <Text
          name="LabelY"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          Y:
        </Text>
        <Input
        name="ValueY"
        fill={color}
        width={35}
        value={String(CMYK.Y)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = CMYK;
          newCol.Y = Number(e.characters);
          setCMYK(newCol);
        }}
        />
        <Text
          name="LabelK"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          K:
        </Text>
        <Input
        name="ValueK"
        fill={color}
        width={35}
        value={String(CMYK.K)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = CMYK;
          newCol.K = Number(e.characters);
          setCMYK(newCol);
        }}
        />
      </AutoLayout>
      <AutoLayout
        name="RGB"
        spacing={5}
      >
        <Text
          name="LabelR"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          R:
        </Text>
        <Input
        name="ValueR"
        fill={color}
        width={35}
        value={String(RGB.r)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
            const newCol = RGB;
            newCol.r = Number(e.characters);
            const HEX = RGBToHEX(newCol.r, newCol.g, newCol.b);
            const CMYK = RGBToCMYK(newCol.r, newCol.g, newCol.b);
            setHEX(HEX.slice(1,7));
            setCMYK(CMYK);
            setRGB(newCol);
          }
        }
        />
        <Text
          name="LabelG"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          G:
        </Text>
        <Input
        name="ValueG"
        fill={color}
        width={35}
        value={String(RGB.g)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = RGB;
          newCol.g = Number(e.characters);
          const HEX = RGBToHEX(newCol.r, newCol.g, newCol.b);
          const CMYK = RGBToCMYK(newCol.r, newCol.g, newCol.b);
          setHEX(HEX.slice(1,7));
          setCMYK(CMYK);
          setRGB(newCol);
        }}
        />
        <Text
          name="LabelB"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          B:
        </Text>
        <Input
        name="ValueB"
        fill={color}
        width={35}
        value={String(RGB.b)}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const newCol = RGB;
          newCol.b = Number(e.characters);
          const HEX = RGBToHEX(newCol.r, newCol.g, newCol.b);
          const CMYK = RGBToCMYK(newCol.r, newCol.g, newCol.b);
          setHEX(HEX.slice(1,7));
          setCMYK(CMYK);
          setRGB(newCol);
        }}
        />
      </AutoLayout>
      <AutoLayout
        name="HEX"
        spacing={5}
      >
        <Text
          name="Label"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          HEX:
        </Text>
        <Input
        name="Value"
        fill={color}
        width={100}
        value={HEX}
        
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{
          const formattedHEX = formatHEX(e.characters);
          const RGB = HEXToRGB(formattedHEX);
          setHEX(formattedHEX.slice(1, 7));
          const CMYK = RGBToCMYK(RGB.r, RGB.g, RGB.b);
          setRGB(RGB);
          setCMYK(CMYK);
        }}
        />
      </AutoLayout>
      <AutoLayout
        name="Pantone"
        spacing={5}
      >
        <Text
          name="Label"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          Pantone:
        </Text>
        <Text
          name="Value"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          ---
        </Text>
      </AutoLayout>
      <AutoLayout
        name="DIC"
        spacing={5}
      >
        <Text
          name="Label"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          DIC:
        </Text>
        <Text
          name="Value"
          fill={color}
          fontFamily="Inter"
          fontSize={18}
        >
          ---
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget)

