//a dialog box that is shown when the user first logs in to alert them to anything, e.g. A new version of the WDPA is available for admin users
import React from "react";
import MarxanDialog from "./MarxanDialog";

class AlertDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
        {...this.props}
        contentWidth={500}
        offsetY={80}
        title="Alert"
        children={
          <div key="k23">
              <div className={'description'}>A new version of the WDPA is available. <br/>Click on Help | Server Details for more information.</div>
          </div>
        }
      />
    );
  }
}

export default AlertDialog;
