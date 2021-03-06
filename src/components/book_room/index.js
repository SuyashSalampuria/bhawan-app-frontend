import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Icon, Message, Grid } from 'semantic-ui-react'
import { DateInput, TimeInput } from 'semantic-ui-calendar-react'
import './index.css'
import { bookRoom } from '../../actions/book-room'
import moment from 'moment'

class BookRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: '',
      fromTime: '',
      endDate: '',
      endTime: '',
      loading: false,
      visitors: [''],
      relatives: [''],
      proof: [],
      proofUrl: []
    }
  }
  componentDidMount() {
    this.props.setNavigation('Book a Room')
  }
  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value })
    }
  }
  increaseVisitor = (event) => {
    this.setState((prevState) => ({
      visitors: [...prevState.visitors, ''],
      relatives: [...prevState.relatives, ''],
    }))
  }

  createForm = () => {
    return this.state.visitors.map((visitor, i) => (
      <div key={i}>
        <Form.Group widths='four'>
          <Form.Field required>
            <label>Name of Visitor</label>
            <Input
              value={visitor || ''}
              onChange={(event) => this.handleVisitorChange(i, event)}
            />
          </Form.Field>
          <Form.Field required>
            <label>Relation</label>
            <Input
              value={this.state.relatives[i] || ''}
              onChange={(event) => this.handleRelativeChange(i, event)}
            />
          </Form.Field>
          <Form.Field required>
            <label for={`uploadPhoto${i}`}>Identity Proof</label>
            <input
              type='file'
              accept='image/*'
              class="upload-btn"
              style={{
                width: "210px",
                height: "38px",
                padding: "3px 0 3px 5px"
                }}
              onChange={(e) => this.handleSelectPicture(e, i)}
              name={`picture${i}`}
              id={`uploadPhoto${i}`}
            />
          </Form.Field>{this.state.visitors.length > 1 && (
            <Icon name='close' size='big' onClick={() => this.removeClick(i)} styleName='cross-mark' />
          )}
        </Form.Group>
      </div>
    ))
  }
  handleVisitorChange(i, event) {
    let visitors = [...this.state.visitors]
    visitors[i] = event.target.value
    this.setState({ visitors })
  }
  handleRelativeChange(i, event) {
    let relatives = [...this.state.relatives]
    relatives[i] = event.target.value
    this.setState({ relatives })
  }

  removeClick(i) {
    let visitors = [...this.state.visitors]
    let relatives = [...this.state.relatives]
    let proof = [...this.state.proof]
    let proofUrl = [...this.state.proofUrl]
    visitors.splice(i, 1)
    relatives.splice(i, 1)
    proof.splice(i, 1)
    proofUrl.splice(i, 1)
    this.setState({
      visitors,
      relatives,
      proof,
      proofUrl,
    })
  }

  handleSubmit = (e) => {
    let formData = new FormData()
    formData.append(
      'requestedFrom',
      moment(this.state.fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    )
    formData.append(
      'requestedTill',
      moment(this.state.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    )
    this.state.visitors.forEach((visitor, index) => {
      formData.append(
        'visitors',
        JSON.stringify({
          full_name: visitor,
          relation: this.state.relatives[index],
        })
      )
      formData.append(`visitors${index}`, this.state.proof[index], 'hey.png')
    })
    this.setState({
      loading: true,
    })
    this.props.bookRoom(
      formData,
      this.props.activeHostel,
      this.successCallBack,
      this.errCallBack
    )
  }
  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      loading: false,
      fromDate: '',
      fromTime: '',
      endDate: '',
      endTime: '',
      visitors: [''],
      relatives: [''],
      proof: [],
      proofUrl: []
    })
  }

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
      loading: false,
    })
  }
  handleSelectPicture = async (e, i) => {
    const z = e.target.files
    if (e.target.files && e.target.files.length == 1) {
      const newProofs = this.state.proof.slice()
      const newProofUrl = this.state.proofUrl.splice()
      const proof = await readFile(z[0])
      const proofFile = await dataURLtoFile(proof, 'image.png')

      newProofs[i] = proofFile
      newProofUrl[i] = URL.createObjectURL(proofFile)
      this.setState({
        proof: newProofs,
        proofUrl: newProofUrl,
      })
    }
  }
  render() {
    const {loading, fromDate, endDate, visitors, relatives, proof } = this.state
    const isTimeInvalid = moment(moment(fromDate, "DD-MM-YYYY")).isAfter
                    (moment(endDate, "DD-MM-YYYY"))
    let disabled = false
    visitors.forEach(visitor => {
        if(visitor.trim() == '')
          disabled = true
    });
    relatives.forEach(relative => {
        if(relative.trim() == '')
          disabled = true
    });
    if(proof.length < visitors.length)
      disabled = true

    return (
      <Grid.Column width={12} floated='left'>
        {this.state.error && (
          <Message warning>
            <Icon name='warning' />
            Your Booking Request could not be made. Please try again
          </Message>
        )}
        {isTimeInvalid && (
            <Message negative>
              Start time cannot be after End time
            </Message>
          )}
        {this.state.success && (
          <Message positive>
            Your Booking Request has been made succesfully
          </Message>
        )}
        <Form>
          <Form.Group widths='four'>
            <Form.Field required>
              <label>From Date</label>
              <DateInput
                name='fromDate'
                value={fromDate}
                onChange={this.handleChange}
                error={isTimeInvalid}
              />
            </Form.Field>
            <Form.Field required>
              <label>Until Date</label>
              <DateInput
                name='endDate'
                value={endDate}
                onChange={this.handleChange}
                error={isTimeInvalid}
              />
            </Form.Field>
          </Form.Group>
          {this.createForm()}
          <Form.Field>
            <Icon
              onClick={this.increaseVisitor}
              name='plus'
              size='big'
              styleName='plus-icon'
            />
          </Form.Field>
          <Form.Field>
            <Button
              primary
              type='submit'
              onClick={this.handleSubmit}
              loading={loading}
              disabled={fromDate=='' || endDate=='' || isTimeInvalid || disabled}
            >
              Submit
            </Button>
          </Form.Field>
        </Form>
      </Grid.Column>
    )
  }
}
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?)/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function mapStateToProps(state) {
  return {
    activeHostel: state.activeHostel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bookRoom: (data, residence, successCallBack, errCallBack) => {
      dispatch(bookRoom(data, residence, successCallBack, errCallBack))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookRoom)
