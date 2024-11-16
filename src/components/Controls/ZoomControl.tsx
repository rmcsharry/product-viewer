import { Component } from 'solid-js';
import { Slider } from '@ark-ui/solid';

interface ZoomControlProps {
  value: number;
  onChange: (value: number) => void;
}

const ZoomControl: Component<ZoomControlProps> = (props) => {
  return (
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Zoom Control</h3>
      <Slider.Root
        value={[props.value]}
        min={1}
        max={10}
        step={0.1}
        onValueChange={(details) => props.onChange(details.value[0])}
        class="w-full"
      >
        <Slider.Control class="relative w-full h-8">
          <Slider.Track class="absolute h-2 top-3 w-full bg-gray-200 rounded-full">
            <Slider.Range class="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          {/* <Slider.Thumb class="absolute top-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" /> */}
        </Slider.Control>
      </Slider.Root>
    </div>
  );
};

export default ZoomControl;