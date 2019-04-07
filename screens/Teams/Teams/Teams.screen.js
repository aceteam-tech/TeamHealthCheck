import React from 'react'
import { Image, Text, Animated, TouchableOpacity } from 'react-native'
import { Content } from 'native-base'
import { observer } from 'mobx-react/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import styled from 'styled-components/native'

import { getMyTeams } from '../../../adapters/api'
import teamStore from '../../../model/team-store'
import { Header, Button, Page, TeamCard, Loader } from '../../../components/index'
import colors from '../../../constants/Colors'
import { signOut } from '../../../adapters/auth'

const iconLink = require('./icon-link-3x.png')
const iconPlus = require('./icon-plus-3x.png')

const AddButtonWrapper = styled.View`
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-right: 20px;
  flex-direction: row;
`

const MenuShadow = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  bottom: 0; 
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,.5);
  display: flex
`

const Menu = styled(Animated.View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 150px;
    background-color: white;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    box-shadow: 0 -2px 3px rgba(0,0,0,0.15);
`

const MenuItem = styled.TouchableOpacity`
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const NoneTeamsWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const NoneTeamsText = styled.Text`
  color: ${colors.air};
  font-size: 20px;
  
`

@observer
export default class TeamsScreen extends React.Component {
    state = {
        isOpen: false,
        bounceValue: new Animated.Value(200)
    }

    toggleMenu() {

        let toValue = 200

        if (!this.state.isOpen) {
            toValue = 0
        }

        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue
            }
        ).start()

        this.setState({ isOpen: !this.state.isOpen })
    }

    chooseTeam = async (team) => {
        teamStore.setTeam(team)
        this.props.navigation.navigate('TeamDashboard')
    }

    componentDidMount() {
        this.updateTeamsSubscription = this.props.navigation.addListener('didFocus', this.updateTeams)
    }

    componentWillUnmount() {
        this.updateTeamsSubscription.remove()
    }

    async updateTeams() {
        const teams = await getMyTeams()
        teamStore.teams = teams
    }

    render() {
        const { navigate } = this.props.navigation
        const { teams } = teamStore
        return (
            <Loader assetsToLoad={[iconLink, iconPlus]}>
                <Page>
                    <Header title='Teams' right={
                        <TouchableOpacity onPress={() => {
                            signOut()
                            navigate('Welcome')
                        }
                        }>
                            <MaterialCommunityIcons color='white' size={27} name='logout'/>
                        </TouchableOpacity>
                    }/>
                    {
                        !teams.length ?
                            <NoneTeamsWrapper>
                                <NoneTeamsText>
                                    {`You don't have any teams.\nAdd or join one.`}
                                </NoneTeamsText>
                            </NoneTeamsWrapper>
                            :
                            <Content>
                                {
                                    teams.map(team => (
                                        <TeamCard key={team.id} onPress={this.chooseTeam} item={team}/>
                                    ))
                                }
                            </Content>
                    }
                    <AddButtonWrapper>
                        <Button onPress={() => this.toggleMenu()} version='add'/>
                    </AddButtonWrapper>

                    {this.state.isOpen
                    && <MenuShadow onPress={() => this.toggleMenu()}/>}

                    <Menu style={{ transform: [{ translateY: this.state.bounceValue }] }}>
                        <MenuItem onPress={() => {
                            navigate('JoinTeam')
                            this.toggleMenu()
                        }}>
                            <Image source={iconLink}
                                   resizeMode='contain'
                                   style={{ height: 40, alignSelf: 'center', margin: 10 }}/>
                            <Text>Join Team</Text>
                        </MenuItem>

                        <MenuItem onPress={() => {
                            navigate('AddTeam')
                            this.toggleMenu()
                        }}>
                            <Image source={iconPlus}
                                   resizeMode='contain'
                                   style={{ height: 40, alignSelf: 'center', margin: 10 }}/>
                            <Text>Add Team</Text>
                        </MenuItem>
                    </Menu>

                </Page>

            </Loader>
        )
    }
}
