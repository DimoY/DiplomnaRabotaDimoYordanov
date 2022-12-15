import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, {tabClasses} from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import React from "react";
import Prop_TopMenuBar from "../../definitions/props/TopMenuBar/Prop_TopMenuBar";

class TopMenuBar extends React.Component{
    constructor(props:Prop_TopMenuBar){
        super(props);

        this.state = {
            loginWidget:props.loginWidget,
            cameraWidget:props.cameraWidget,
            notificationWidget:props.notificationWidget
        }
    }
    render(){
        return(
                <Box
                    sx={{
                        bgcolor: 'background.body',
                        flexGrow: 1,
                        m: -3,
                        overflowX: 'hidden',
                        borderRadius: 'md',
                    }}
                >
                    <Tabs
                        aria-label="Pipeline"
                        // value={index}
                        // onChange={(event, value) => setIndex(value as number)}
                        sx={{ '--Tabs-gap': '0px' }}
                    >
                        <TabList
                            variant="plain"
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                mx: 'auto',
                                pt: 2,
                                alignSelf: 'flex-start',
                                [`& .${tabClasses.root}`]: {
                                    bgcolor: 'transparent',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                    },
                                    [`&.${tabClasses.selected}`]: {
                                        color: 'primary.plainColor',
                                        fontWeight: 'lg',
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            zIndex: 1,
                                            bottom: '-1px',
                                            left: 'var(--List-item-paddingLeft)',
                                            right: 'var(--List-item-paddingRight)',
                                            height: '3px',
                                            borderTopLeftRadius: '3px',
                                            borderTopRightRadius: '3px',
                                            bgcolor: 'primary.500',
                                        },
                                    },
                                },
                            }}
                        >
                            <Tab>
                                Log in{" "}
                            </Tab>
                            <Tab>
                                Notifications{' '}
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    // color={index === 1 ? 'primary' : 'neutral'}
                                    sx={{ ml: 1 }}
                                >
                                    24
                                </Chip>
                            </Tab>
                            <Tab>LiveFeed</Tab>
                        </TabList>
                        <Box
                            sx={(theme) => ({
                                '--bg': theme.vars.palette.background.level3,
                                height: '1px',
                                background: 'var(--bg)',
                                boxShadow: '0 0 0 100vmax var(--bg)',
                                clipPath: 'inset(0 -100vmax)',
                            })}
                        />
                        <Box
                            sx={(theme) => ({
                                '--bg': theme.vars.palette.background.surface,
                                background: 'var(--bg)',
                                boxShadow: '0 0 0 100vmax var(--bg)',
                                clipPath: 'inset(0 -100vmax)',
                                px: 4,
                                py: 2,
                            })}
                        >
                            <TabPanel value={0}>
                                {this.state.loginWidget}
                            </TabPanel>
                            <TabPanel value={1}>
                                {this.state.notificationWidget}
                            </TabPanel>
                            <TabPanel value={2}>
                                {this.state.cameraWidget}
                            </TabPanel>
                        </Box>
                    </Tabs>
                </Box>
            );
    }
}

export default TopMenuBar;