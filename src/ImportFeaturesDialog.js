import * as React from 'react';
import MarxanImportFeatureDialog from './MarxanImportFeatureDialog';
import MarxanTextField from './MarxanTextField';
import FileUpload from './FileUpload.js';
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ToolbarButton from './ToolbarButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

let INITIAL_STATE = { steps: ['shapefile', 'single_or_multiple', 'metadata'], stepIndex: 0, fieldnames: [], splitField: "", name: "", description: "" };
class ImportFeaturesDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = INITIAL_STATE;
	}
	handleNext(){
		const { stepIndex } = this.state;
		switch (stepIndex) {
			case 0:
				//unzip the shapefile on the server
				this.props.unzipShapefile(this.props.filename).then((response) => {
					//get the name of the shapefile in the zip file
					this.shapefile = response.rootfilename + ".shp";
					this.setState({ stepIndex: stepIndex + 1 });
				});
				break;
			case (this.state.steps.length - 1):
				this.importFeatures();
				break;
			default:
				this.setState({ stepIndex: stepIndex + 1 });
		}
	}
	handlePrev(){
		const { stepIndex } = this.state;
		this.setState({ stepIndex: stepIndex - 1 });
	}
	changeName(event, newValue) {
		this.setState({ name: newValue });
	}
	changeDescription(event, newValue) {
		this.setState({ description: newValue });
	}
	changeSplitField(event, index) {
		this.setState({ splitField: this.state.fieldnames[index] });
	}
	getShapefileFieldnames() {
		//get the field names from the unzipped shapefile on the server
		this.props.getShapefileFieldnames(this.shapefile).then((response) => {
			//set the fieldnames in local state
			this.setState({ fieldnames: response.fieldnames });
		});
	}
	resetFieldnames() {
		this.setState({ fieldnames: [] });
	}
	importFeatures() {
		this.props.importFeatures(this.props.filename, this.state.name, this.state.description, this.shapefile, this.state.splitField).then((response) => {
			this.closeDialog();
		});
	}
	closeDialog() {
		//delete the zip file and shapefile
		this.props.deleteShapefile(this.props.filename, this.shapefile);
		this.setState(INITIAL_STATE);
		this.shapefile = "";
		this.props.setFilename("");
		this.props.onCancel();
	}
	render() {
		let _disabled = false;
		const { stepIndex } = this.state;
		const contentStyle = { margin: '0 16px' };
		//get the disabled state for the next/finish button
		switch (stepIndex) {
			case 0:
				_disabled = (this.props.filename === "");
				break;
			case 1:
				_disabled = (this.props.loading);
				break;
			default:
				// code
		}
		const actions = [
			<div style={{width: '100%', maxWidth: '500px', margin: 'auto',textAlign:'center'}}>
				<div style={contentStyle}>
					<div style={{marginTop: 12}}>
						<ToolbarButton label="Back" disabled={stepIndex === 0 || this.props.loading} onClick={this.handlePrev.bind(this)} />
						<ToolbarButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={this.handleNext.bind(this)} disabled={_disabled || this.props.loading} primary={true}/>
					</div>
				</div>
			</div>
		];
		let children =
			<div key="k12" style={{height:'120px',maxHeight:'120px'}}>
				{stepIndex === 0 ? 
					<div className={'importFeaturesContent'}>
						<FileUpload SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} requestEndpoint={this.props.requestEndpoint} checkForErrors={this.props.checkForErrors} mandatory={true} filename={this.props.filename} setFilename={this.props.setFilename} label="Shapefile" style={{'paddingTop':'10px'}}/> 
					</div>
				: null}
				{stepIndex === 1 ? 
					<div className={'importFeaturesContent'}>
					    <RadioButtonGroup name="createFeatureType" defaultSelected="single">
					      <RadioButton value="single" label="Create single feature" style={{padding:'10px'}} onClick={this.resetFieldnames.bind(this)}/>
					      <RadioButton value="multiple" label="Split into multiple features" style={{padding:'10px'}} onClick={this.getShapefileFieldnames.bind(this)}/>
					    </RadioButtonGroup>
					</div>
				: null}
				{(stepIndex === 2) ? 
				(this.state.fieldnames.length === 0) ?
					<div className={'importFeaturesContent'}> 
						<MarxanTextField value={this.state.name} onChange={this.changeName.bind(this)} floatingLabelText="Enter a name" />
						<MarxanTextField value={this.state.description} onChange={this.changeDescription.bind(this)} multiLine={true} rows={2} floatingLabelText="Enter a description"/>
					</div> :
					<div className={'importFeaturesContent'}> 
						<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeSplitField.bind(this)} value={this.state.splitField} floatingLabelText="Split features by" floatingLabelFixed={true}>
							{this.state.fieldnames.map(item => {
								return (
									<MenuItem style={{ fontSize: "12px" }} value={item} primaryText={item} key={item} />
								);
							})}
						</SelectField> 
					</div> 
				: null}
			</div>;
		return (
			<MarxanImportFeatureDialog  
				{...this.props} 
				onOk={this.closeDialog.bind(this)}
				okLabel={"Cancel"}
				contentWidth={540}
				title= {"Import features"}
				children={children} 
				actions={actions}  
				onRequestClose={this.closeDialog.bind(this)} 
				helpLink={"user.html#importing-existing-features"}
			/>
		);
	}
}

export default ImportFeaturesDialog;
