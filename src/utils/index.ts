export const getEnumValueByKey = <T extends object>(
	enumObject: T,
	value: string
): T[keyof T] => {
	return Object.entries(enumObject).find(
		([, enumValue]) => enumValue === value
	)?.[1] as T[keyof T]
}
