import React from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alldata: [],
      singledata: {
        title: "",
        author: "",
      },
    };
  }
  getLists = () => {
    this.setState({ loading: true });
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          alldata: result,
          loading: false,
        });
      })
      .catch(console.log);
  };
  getList = (event, id) => {
    this.setState(
      {
        singledata: {
          title: "Loading...",
          author: "Loading...",
        },
      },
      () => {
        fetch("http://localhost:5000/posts/" + id)
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              singledata: {
                title: result.title,
                author: result.author ? result.author : "",
              },
            });
          })
          .catch(console.log);
      }
    );
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      singledata: {
        ...prevState.singledata,
        [name]: value,
      },
    }));
  };

  createList = () => {
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.singledata),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          alldata: [...prevState.alldata, data],
          singledata: {
            title: "",
            author: "",
          },
        }));
      })
      .catch(console.log);
  };
  updateList = (event, id) => {
    fetch("http://localhost:5000/posts" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.singledata),
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          singledata: {
            title: "",
            author: "",
          },
        });
        this.getLists();
      });
  };
  deleteList = (event, id) => {
    fetch("http://localhost:5000/posts/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          singledata: {
            title: "",
            author: "",
          },
        });
        this.getLists();
      })
      .catch(console.log);
  };
  render() {
    const listTable = this.state.loading ? (
      <span>Loading Data ......Please be patient.</span>
    ) : (
      <Lists
        alldata={this.state.alldata}
        singledata={this.state.singledata}
        getList={this.getList}
        updateList={this.updateList}
        deleteList={this.deleteList}
        handleChange={this.handleChange}
      />
    );

    return (
      <div className="container">
        <span className="title-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.getLists}
          >
            Get Lists
          </button>
          <CreateList
            singledata={this.state.singledata}
            handleChange={this.handleChange}
            createList={this.createList}
          />
        </span>
        {listTable}
      </div>
    );
  }
}

export default App;
