import React from 'react'
import { Input, Label, Item, Form } from 'native-base'
import { KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components/native'
import { Button, Header, Page, TeamLogo, ArrowBack } from '../../../components'
import { labelStyle, inputStyle } from '../../../constants/Style'
import teamsStore  from '../../../model/teams-store'

const HeaderWrapper = styled.View`
  margin-bottom: 30px;
`

const PageContent = styled.View`
  flex: 1;
  justify-content: space-between;
`
const Top = styled.View`
  justify-content: center;
  align-items: center;
`
const Footer = styled.View``
const Middle = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 45px;
`

export default class AddTeamScreen extends React.Component {
    state = {
        name: ''
    }

    onTextChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    async addTeam() {
        await teamsStore.addTeam(this.state.name)
        this.props.navigation.goBack()
    }

    render() {
        const { goBack } = this.props.navigation
        return (
            <Page version={2} dismissKeyboard={true}>
                <KeyboardAvoidingView style={{ flex: 1 }}
                                      behavior="position"
                                      contentContainerStyle={{ flex: 1 }}>
                    <HeaderWrapper>
                        <Header title='ADD TEAM' left={<ArrowBack onPress={() => goBack(null)}/>}/>
                    </HeaderWrapper>

                    <PageContent>
                        <Top>
                            <TeamLogo name={this.state.name} size={100}/>
                        </Top>
                        <Middle>
                            <Form style={{ justifyContent: 'center', marginRight: 15 }}>
                                <Item floatingLabel>
                                    <Label style={labelStyle}>Team name</Label>
                                    <Input style={inputStyle}
                                           autoCorrect={false}
                                           autoCapitalize='words'
                                           textContentType='givenName'
                                           value={this.state.name}
                                           onChangeText={(val) => this.onTextChange('name', val)}/>
                                </Item>
                            </Form>
                        </Middle>
                        <Footer>
                            <Button version='secondary' onPress={() => this.addTeam()} text='Add'/>
                        </Footer>
                    </PageContent>

                </KeyboardAvoidingView>
            </Page>
        )
    }
}