import { FC, PropsWithChildren } from "react"
import { Box, styled } from "@mui/material"

const MainContentWrapper = styled(Box)(() => {
	return {
		display: "flex",
		flexDirection: "column",
		flex: 1,
		margin: "auto",
	}
})

export const MainContent: FC<PropsWithChildren> = ({
	children,
}): JSX.Element => {
	return <MainContentWrapper as={"main"}>{children}</MainContentWrapper>
}
