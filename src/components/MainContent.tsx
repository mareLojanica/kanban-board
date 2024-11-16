import { Box, styled } from "@mui/material"
import { FC, PropsWithChildren } from "react"

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
