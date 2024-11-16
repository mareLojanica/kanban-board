import { PointerSensor } from "@dnd-kit/core"

export class CustomPointerSensor extends PointerSensor {
	static activators = [
		{
			eventName: "onPointerDown" as const,
			handler: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
				const target = nativeEvent.target as HTMLElement

				return !target.closest("[data-no-dnd]")
			},
		},
	]
}
