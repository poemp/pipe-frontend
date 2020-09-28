/**
 * @description: 数据中台-数据源-数据源管理
 * @author: hj
 * @update: hj(2020-01-14)
 */
import React from 'react';
import Container from '@icedesign/container';
import styles from './index.module.scss';
import url from '@/request'
import {Button, Card, Dialog, Input, Message, Pagination, Table, Upload} from "@alifd/next";
import ZgDialog from '@/components/ZgDialog';
import axios from 'axios';
import $http from '@/service/Services';
import AuthButton from "@/components/AuthComponent/AuthBotton";


const commonProps = {
  style: {width: 450},
  title: '提示信息',
  subTitle: '上传数据提示'
};

/**
 * list
 */
class DataSourceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      mockData: [],
      selectedList: [],
      uploadVisible: false,
      errorMsg: [],
      condition: "",
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      }
    };
    this.pageNum = 1; // 当前页数
    this.pageSize = 10; // 分页每页显示数据条数
    this.totalNum = 0; // 数据总条数
    this.$http = $http;
    this.cancelCall = this.cancelCall.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.getMetadataItemList = this.getMetadataItemList.bind(this);
    this.deleteEventTracking = this.deleteEventTracking.bind(this);
  }

  /**
   * 在渲染前调用,在客户端也在服务端
   */
  componentWillMount = () => {
    this.getMetadataItemList();
  };


  /**
   * 条件
   * @param e
   * @param value
   */
  searchCondition = (value, e) => {
    this.setState({
      condition: value,
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      }
    });
    this.pageNum = 1;
  };
  /**
   * 改变页面
   * @param currentPage
   */
  onPageChange = (currentPage) => {
    this.state = {
      current: currentPage,
      mockData: this.props.mockData,
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      }
    };
    this.getMetadataItemList();
  };
  /**
   * 修改分页数据
   * @param currentPage
   */
  onChangePage = (currentPage) => {
    this.setState({
      loading: true,
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      }
    });
    setTimeout(() => {
      this.getMetadataItemList(currentPage);
      this.setState({
        loading: false,
        config: {
          data: null,
          visible: false,
          title: "",
          content: ""
        }
      });
    }, 0);
  };

  /**
   * 获取数据
   */
  getMetadataItemList = (pageNum) => {
    const _this = this;

    _this.pageNum = typeof (pageNum) == "number" ? pageNum : _this.pageNum;
    let urls = url.url + '/v1/tDataSource/findDataSourceList/' + _this.pageSize + '/' + _this.pageNum;
    this.$http.get(urls, {
      params: {
        subjectId: this.state.subjectId
      }
    })
      .then(function (response) {
        const {data} = response;
        _this.totalNum = data.data.total;
        data.data.voList.forEach((o, i) => {
          o.number = i + 1;
        });
        _this.setState({
          mockData: data.data.voList,
          current: data.data.current,
          config: {
            data: null,
            visible: false,
            title: "",
            content: ""
          }
        });
      })
      .catch(function (error) {
        Message.error(error.message);
      })

  };


  /**
   * 删除
   */
  deleteEventTracking = (row) => {
    this.setState({
        config: {
          data: row,
          visible: true,
          title: "提示消息",
          content: "删除后不能恢复，确认要删除？"
        }
      }
    )
  };

  /**
   * 取消按钮的操作
   */
  cancelCall = () => {
    this.setState({
      config: {
        visible: false
      }
    });
  };


  /**
   * 删除
   */
  okCall = (data) => {
    this.setState({
      config: {
        visible: false
      }
    });
    const _this = this;
    this.$http.post(url.url + '/v1/tDataSource/deleteDataSourceById?dataSourceId=' + data.id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success("操作成功.");
          _this.getMetadataItemList();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  /**
   * 批量删除
   * @param ids
   */
  handleSelect = (ids) => {
    const _this = this;
    this.$http.post(url.url + '/v1/tDataSource/deleteDataSource', {ids: ids})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success("操作成功.");
          _this.getMetadataItemList();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };
  /**
   * 批量操作
   * @param text
   */
  handleClick = () => {
    const {selectedList} = this.state;
    if (selectedList.length == 0) {
      Message.error("请选择需要删除的数据.");
      return null;
    }
    this.setState({
      visible: true
    });
  };

  /**
   *
   * @param args
   */
  onChange = (...args) => {
    this.setState({
      selectedList: args
    });
  };


  /**
   * 确定提示弹框
   */
  onOkDialog = () => {
    this.setState({
      visible: false
    });
    const {selectedList} = this.state;
    this.handleSelect(selectedList[1].map(o => {
      return o.id;
    }));
  };
  /**
   * 取消提示弹框
   */
  onCloseDialog = reason => {
    this.setState({
      visible: false
    });
  };

  /**
   * 取消提示弹框
   */
  onImportCloseDialog = reason => {
    this.setState({
      uploadVisible: false
    });
  };

  /**
   *
   * @param file  {Object} 文件
   * @param value {Array} 值
   */
  onSuccess = (file, value) => {
    const dataList = file.response.data.exportDataSourceVos;
    const errorMsg = file.response.data.message;
    if (dataList && dataList.length > 0) {
      Message.success("导入成功.");
      this.setState({
        uploadVisible: false
      }, () => {
        setTimeout(() => {
          location.reload(true);
        }, 200)
      });
    } else {
      this.setState(
        {
          errorMsg: errorMsg
        }
      )
    }

  };

  /**
   * 导入数据
   */
  uploadVersion = () => {
    this.setState({
      uploadVisible: true
    });
  };
  /**
   *
   * @param file  {Object} 出错的文件
   * @param fileList  {Array} 当前值
   */
  onError = (file, fileList) => {
  };

  /**
   * 导出模板
   * @param record
   */
  downTemplate = (record) => {
    //导出事件列表
    axios({
      method: 'get',
      url: url.url + '/v1/tDataSource/exportDataSourceTemplate',
      data: {},
      headers: {
        "Authorization": sessionStorage.getItem("Authorization")
      }, // 在这里设置请求头与携带token信息
      responseType: 'blob'
    }).then(resp => {
      let headers = resp.headers;
      let contentType = headers['content-type'];
      if (!resp.data) {
        console.error('响应异常：', resp);
        return false;
      } else {
        const blob = new Blob([resp.data], {type: contentType});
        const contentDisposition = resp.headers['content-disposition'];
        let fileName = record.name + '数据源导入模板数据列.xls';
        if (contentDisposition) {
          fileName = window.decodeURI(resp.headers['content-disposition'].split('=')[1]);
        }
        this.downFile(blob, fileName);
      }
    }).catch((error) => {

    })
  };


  render() {
    const {mockData} = this.state;
    const actionUrl = url.url + '/v1/tDataSource/importDataSource/' + this.state.subjectId + "?save=true";
    return (
      <div>
        <div className='container-header'>
          <p>数据源管理</p>
        </div>
        <Container className='container-main'>
          <div className='container-btnBox' style={{marginTop: '0'}}>
            <div className={styles.buttons}>
              <AuthButton auth={"DATA_CENTER$_DATASOURCE$_ADD"}
                          link={{to: "dataSourceAdd?dataSourceId=", text: "新建数据源"}}/>
              <AuthButton auth={"DATA_CENTER$_DATASOURCE$_BATCH_DELETE"}
                          onClick={() => this.handleClick()}
                          title={"批量删除"}/>
              <span className={styles.caseNumber}>
                                <Input onChange={this.searchCondition.bind(this)} placeholder={"数据源名称"}
                                       className={`${styles.input} ${styles.shortInput}`}/>
                                <Button
                                  type="primary"
                                  className='zgph-btn-search'
                                  onClick={this.getMetadataItemList}
                                >
                                查询
                                </Button>
                            </span>
            </div>
          </div>
          <div className='container-table'>
            <Table dataSource={mockData}  size={'small'} primaryKey="id" className={styles.table}
                   rowSelection={{
                     onChange: this.onChange,
                     getProps: (record, index) => {
                       return {
                         children: ""
                       };
                     },
                     columnProps: () => {
                       return {
                         lock: 'left',
                         width: 90,
                         align: 'center'
                       };
                     },
                     titleAddons: () => {
                       return;
                     },
                     titleProps: () => {
                       return {
                         children: ''
                       };
                     }
                   }}>
              <Table.Column align="center" title="序号" width={50}  cell={
                (value, index, record) => {return index + 1 + (this.pageNum - 1) * this.pageSize;}
              }/>
              <Table.Column align="center" title="数据源名称" dataIndex="sourceName"/>
              <Table.Column align="center" width={120} title="数据源类型" dataIndex="sourceType"/>
              <Table.Column align="center" title="链接地址" dataIndex="ip"/>
              <Table.Column align="center" width={80} title="端口号" dataIndex="port"/>
              <Table.Column align="center" title="用户名" dataIndex="userName"/>
              <Table.Column align="center" title="数据库" dataIndex="sourceSchema"/>
              <Table.Column align="center" title="创建时间" dataIndex="createTime"/>
              <Table.Column align="center" title="操作" cell={
                (value, index, record) => {
                  return (
                    <div>
                      <AuthButton text auth={"DATA_CENTER$_DATASOURCE$_DETAIL"} type="normal"
                                  size="small"
                                  link={{
                                    to: "dataSourceDetail?dataSourceId=" + record.id,
                                    text: "详情"
                                  }}/>
                      <AuthButton text auth={"DATA_CENTER$_DATASOURCE$_EDIT"} type="normal"
                                  size="small"
                                  link={{
                                    to: "dataSourceAdd?dataSourceId=" + record.id,
                                    text: "修改"
                                  }}/>
                      <AuthButton text auth={"DATA_CENTER$_DATASOURCE$_DELETE"} type="normal"
                                  onClick={() => this.deleteEventTracking(record)} size="small"
                                  title={"删除"}/>
                    </div>
                  )
                }
              }/>
            </Table>
            <ZgDialog config={this.state.config} cancelCall={this.cancelCall} okCall={this.okCall}/>
            <Dialog
              className='zgph-dialog'
              title="提示信息"
              visible={this.state.visible}
              onOk={this.onOkDialog}
              onCancel={this.onCloseDialog.bind(this, 'cancelClick')}
              onClose={this.onCloseDialog}>
              删除后不能恢复，确认要删除？
            </Dialog>
            <Dialog
              className='zgph-dialog'
              title="导入数据源"
              footer={<Button warning type="primary" onClick={this.onImportCloseDialog}>取消上传</Button>}
              visible={this.state.uploadVisible}
              onCancel={this.onImportCloseDialog.bind(this, 'cancelClick')}
              onClose={this.onImportCloseDialog}>
              <div>
                <Upload
                  headers={
                    {
                      'Authorization': sessionStorage.getItem("Authorization")
                    }
                  }
                  accept={".xls,.xlsx"}
                  action={actionUrl}
                  limit={1}
                  listType="text"
                  onSuccess={this.onSuccess = this.onSuccess.bind(this)}
                  onError={this.onError = this.onError.bind(this)}>
                  <Button type="primary" style={{margin: '0 0 10px'}}>上传</Button>
                </Upload>
                <Card {...commonProps} contentHeight={400}>
                  <div className="custom-content">
                    {
                      this.state.errorMsg.length > 0 ? this.state.errorMsg.map(o => {
                        return (
                          <Message key={"error"} title={""} type={"error"} size={"medium"}>
                            {o}
                          </Message>
                        )
                      }) : () => {
                        return (
                          <Message key={"success"} title={"导入成功"} type={"success"}
                                   size={"medium"}>
                            导入成功
                          </Message>
                        )
                      }
                    }
                  </div>
                </Card>
              </div>
            </Dialog>
          </div>
          {/**
           * 分页
           * defaultCurrent 初始页码
           * total 总记录数
           * pageSize 一页中的记录数
           */}
          <Pagination defaultCurrent={1}
                      pageSize={this.pageSize}
                      total={this.totalNum}
                      onChange={this.onChangePage}
                      className="page-demo"
                      style={{textAlign: 'center'}}
          />
        </Container>
      </div>
    )
      ;
  }

}

export default DataSourceList;
