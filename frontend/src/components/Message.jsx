const Message = ({ message, error }) => {
  let messageStyle = null
  error ? messageStyle = {
    color: 'red',
    padding: 10,
    backgroundColor: 'lightgray',
    fontSize: 40,
    borderStyle: 'solid',
    borderRadius: 8
  }
    :
    messageStyle = {
      color: 'green',
      padding: 10,
      backgroundColor: 'lightgray',
      fontSize: 40,
      borderStyle: 'solid',
      borderRadius: 8
    }
  return (
    <div style={messageStyle} className='error'>
      {message}
    </div>
  )
}

export default Message