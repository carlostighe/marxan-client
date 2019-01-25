import React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';
import TextField from 'material-ui/TextField';

class ResendPasswordDialog extends React.Component {

    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.resendPassword();
    }
    render() {
        const actions = [
            <ToolbarButton label="Close" primary={true} onClick={this.props.closeResendPasswordDialog} disabled={this.props.resending} />,
            <ToolbarButton onClick={this.props.resendPassword} label= {"Resend"} disabled = {!this.props.email || this.props.resending} primary={true} type="submit"/>
        ];
        return (
            <React.Fragment>
                <MarxanDialog 
                    {...this.props} 
                    actions={actions} 
                    title="Resend email" 
                    children={[<div key="resendDiv">
                        <TextField floatingLabelText="email address" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeEmail(value)}  value={this.props.email} className='loginUserField' disabled = {this.props.resending} onKeyPress={this.handleKeyPress.bind(this)}/>
                </div>]}
                    onRequestClose={this.props.closeNewUserDialog} 
                />
            </React.Fragment>
        );
    }
}

export default ResendPasswordDialog;
