// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useEffect } = widget

import {formatHEX} from "../lib/formatHEX";
import {HEXToRGB} from "../lib/HEXToRGB";
import {RGBToHEX} from "../lib/RGBToHEX";
import {RGBToCMYK} from "../lib/RGBToCMYK";

function Widget() {
  const widgetId = widget.useWidgetId();
  const [count, setCount] = useSyncedState('count', 0)
  const [name, setName] = useSyncedState<string>('name', "ColorName");
  const [CMYK, setCMYK] = useSyncedState<{C: number, M: number, Y: number, K: number}>('cmyk', {C: 0, M: 0, Y: 0, K: 0});
  const [RGB, setRGB] = useSyncedState<{r: number, g: number, b: number}>('rgb', {r: 255, g: 255, b: 255});
  const [HEX, setHEX] = useSyncedState<string>('hex', "FFFFFF");
  const [load, setLoad] = useSyncedState<boolean>('load', true);
  const [frameId, setFrameId] = useSyncedState<string>('frameId', "");

  usePropertyMenu([
    {itemType: 'action',
      tooltip: 'LayoutSettng',
    propertyName: 'Layout Setting'}
  ], ()=>{
    //@ts-ignore
    alert("coming soon...")
  })

  useEffect(() => {
      if(load) {
        setLoad(false);
        const currentWidget = figma.getNodeById(widgetId) as WidgetNode;
        const frame = figma.createFrame();
        frame.x = currentWidget.x;
        frame.y = currentWidget.y;
        currentWidget.x = 0;
        currentWidget.y = 0;
        frame.resize(400, 400);
        frame.appendChild(currentWidget);
        figma.currentPage.appendChild(frame);
        setFrameId(frame.id);
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
        fill="#000"
        value={name}
        placeholder="Name"
        inputBehavior="wrap"
        fontFamily="Inter"
        fontSize={18}
        verticalAlignText="center"
        onTextEditEnd={(e)=>{setName(e.characters)}}
      />
      <AutoLayout
        name="CMYK"
        spacing={0}
      >
        <Text
          name="LableC"
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          C:
        </Text>
        <Input
        name="ValueC"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          M:
        </Text>
        <Input
        name="ValueM"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          Y:
        </Text>
        <Input
        name="ValueY"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          K:
        </Text>
        <Input
        name="ValueK"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          R:
        </Text>
        <Input
        name="ValueR"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          G:
        </Text>
        <Input
        name="ValueG"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          B:
        </Text>
        <Input
        name="ValueB"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          HEX:
        </Text>
        <Input
        name="Value"
        fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          Pantone:
        </Text>
        <Text
          name="Value"
          fill="#000"
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
          fill="#000"
          fontFamily="Inter"
          fontSize={18}
        >
          DIC:
        </Text>
        <Text
          name="Value"
          fill="#000"
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

