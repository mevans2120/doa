import {Stack, Text} from '@sanity/ui'
import {ImageInput} from 'sanity'
import {set, type ImageInputProps} from 'sanity'

export function CircleImageInput(props: ImageInputProps) {
  return (
    <Stack space={3}>
      <Text size={1} muted>
        This image will be displayed as a circle. Position the focal point (hotspot) to ensure the
        subject's face or main feature stays centered.
      </Text>
      <ImageInput {...props} />
      <style>
        {`
          /* Hide aspect ratio buttons in the crop dialog */
          [data-ui="AspectRatioButtonGroup"],
          [aria-label*="aspect ratio"] {
            display: none !important;
          }

          /* Make the crop overlay circular to preview the final result */
          .sanity-crop-tool__crop-area {
            border-radius: 50%;
          }
        `}
      </style>
    </Stack>
  )
}
