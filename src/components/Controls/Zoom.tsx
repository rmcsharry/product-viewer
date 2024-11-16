import { Component } from 'solid-js';
import { Slider } from '@ark-ui/solid';

interface ZoomProps {
  value: number;
  onChange: (value: number) => void;
}

const Zoom: Component<ZoomProps> = (props) => {
  // Convert the value to a percentage for the Range component
  // const getInvertedValue = (value: number) => 11 - value;

  return (
    <div class="h-[400px] flex items-center relative">
      {/* Reference lines */}
      <div class="absolute right-8 h-full flex flex-col justify-between pointer-events-none">
        <div class="text-sm text-gray-500">0%</div>
        <div class="text-sm text-gray-500">50%</div>
        <div class="text-sm text-gray-500">100%</div>
      </div>
      
      <div class="relative h-full flex items-center">
        {/* Reference lines */}
        <div class="absolute w-8 h-full flex flex-col justify-between items-end pointer-events-none">
          <div class="w-4 h-[1px] bg-gray-300"></div>
          <div class="w-4 h-[1px] bg-gray-300"></div>
          <div class="w-4 h-[1px] bg-gray-300"></div>
        </div>

        <Slider.Root
          value={[props.value]}
          min={1}
          max={10}
          step={0.1}
          orientation="vertical"
          onValueChange={(details) => props.onChange(details.value[0])}
          class="h-full"
        >
          <Slider.Control class="relative w-8 h-full">
            <Slider.Track class="absolute w-2 h-full left-3 bg-gray-200 rounded-full">
              <Slider.Range 
                class="absolute w-full bg-blue-500 rounded-full" 
                style={{
                  "bottom": "0",
                  "height": `${((props.value - 1) / 9) * 100}%`
                }}
              />
            </Slider.Track>
            {/* <Slider.Thumb class="absolute left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" /> */}
          </Slider.Control>
        </Slider.Root>
      </div>
    </div>
  );
};

export default Zoom;