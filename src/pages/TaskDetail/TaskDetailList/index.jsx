/**
 * @description: 数据中台-任务-任务管理
 * @author: hj
 * @update: hj(2020-01-14)
 */
import React from 'react';
import Container from '@icedesign/container';
import styles from './index.module.scss';
import url from '@/request'
import {Button, Dialog, Input, Message, Pagination, Table} from '@alifd/next';
import ZgDialog from '@/components/ZgDialog';
import $http from '@/service/Services';
import AuthButton from '../../../components/AuthComponent/AuthBotton';


/**
 * list
 */
class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectId: '',
      current: 0,
      mockData: [],
      selectedList: [],
      condition: '',
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    };
    this.pageNum = 1; // 当前页数
    this.pageSize = 10; // 分页每页显示数据条数
    this.totalNum = 0; // 数据总条数
    this.$http = $http;
    this.cancelCall = this.cancelCall.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.getTaskList = this.getTaskList.bind(this);
    this.deleteEventTracking = this.deleteEventTracking.bind(this);
  }

  /**
   * 在渲染前调用,在客户端也在服务端
   */
  componentWillMount = () => {
    this.getTaskList();
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
        title: '',
        content: ''
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
        title: '',
        content: ''
      }
    };
    this.getTaskList();
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
        title: '',
        content: ''
      }
    });
    setTimeout(() => {
      this.getTaskList(currentPage);
      this.setState({
        loading: false,
        config: {
          data: null,
          visible: false,
          title: '',
          content: ''
        }
      });
    }, 0);
  };

  /**
   * 获取数据
   */
  getTaskList = (pageNum) => {
    const _this = this;
    _this.pageNum = typeof (pageNum) == 'number' ? pageNum : _this.pageNum;
    let urls = url.url + '/v1/taskDetail/getTaskDetailPage/' + _this.pageSize + '/' + _this.pageNum;
    this.$http.get(urls, {
      params: {
        value: _this.state.condition
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
            title: '',
            content: ''
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
          title: '提示消息',
          content: '删除后不能恢复，确认要删除？'
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
    console.log('点击取消按钮 .');
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
    this.$http.post(url.url + '/v1/taskDetail/deleteTask', {ids: [data.id]})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getTaskList();
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
    this.$http.post(url.url + '/v1/taskDetail/deleteTask', {ids: ids})
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getTaskList();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  /**
   * start complete sync
   * @param id
   */
  startCompleteStartTask = (id) => {
    const _this = this;
    this.$http.post(url.url + '/v1/taskDetail/startCompleteStartTask/' + id)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getTaskList();
        }
      })
      .catch(function (error) {
        Message.error(error.message);
      })
  };

  /**
   * start complete sync
   * @param record
   */
  changeStatus = (record) => {
    const _this = this;
    const urls = record.status == 0 ? url.url + '/v1/taskDetail/availability/' + record.id:url.url + '/v1/taskDetail/unavailable/' + record.id
    this.$http.post(urls)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          Message.success('操作成功.');
          _this.getTaskList();
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
      Message.error('请选择需要删除的数据.');
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


  render() {
    const {mockData} = this.state;
    return (
      <div>
        <div className='container-header'>
          <p>任务管理</p>
        </div>
        <Container className='container-main'>
          <div className='container-btnBox' style={{marginTop: '0'}}>
            <div className={styles.buttons}>
              <AuthButton auth={'DATA_CENTER$_METADATA$_ADD_METADATA'} type="normal" size="small"
                          link={{to: 'task-add?id=', text: '新建任务'}}/>
              <AuthButton auth={'DATA_CENTER$_METADATA$_BATCH_DELETE_METADATA'}
                          onClick={() => this.handleClick()} type="normal" size="small"
                          title={'批量删除'}/>
              <span className={styles.caseNumber}>
                                <Input onChange={this.searchCondition.bind(this)} placeholder={'元数据id/元数据名称'}
                                       className={`${styles.input} ${styles.shortInput}`}/>
                                <Button
                                  type="primary"
                                  className='zgph-btn-search'
                                  onClick={this.getTaskList}
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
                         children: ''
                       };
                     },
                     columnProps: () => {
                       return {
                         lock: 'left',
                         width: 40,
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
              <Table.Column align="center" title="任务名称" dataIndex="name"/>
              <Table.Column align="center" width={150} title="源数据库" dataIndex="datasourceName"/>
              <Table.Column align="center" width={150} title="目标数据库" dataIndex="targetName"/>
              <Table.Column align="center" title="同步" width={80} dataIndex="complete" cell={
                (value, index, record) => {
                  if (record.complete === 1) {
                    return "增量同步"
                  }else{
                    return "全量同步"
                  }
                }
              }/>
              <Table.Column align="center" title="状态"  width={60}  dataIndex="availability" cell={
                (value, index, record) => {
                  if (record.availability === 1) {
                    return "可用"
                  }else{
                    return "不可用"
                  }
                }
              }/>
              <Table.Column align="center" title="创建时间" width={140} dataIndex={'createTime'}/>
              <Table.Column align="center" title="描述" dataIndex="content"/>
              <Table.Column align="center" title="操作" cell={
                (value, index, record) => {
                  return (
                    <div>
                      <AuthButton auth={'DATA_CENTER$_METADATA$_ADD_METADATA'} type="normal" size="small"
                                  link={{to: 'task-add?id=' + record.id, text: '修改'}}/>
                      <AuthButton text auth={'DATA_CENTER$_METADATA$_DELETE_METADATA'} type="normal"
                                  onClick={() => this.startCompleteStartTask(record.id)} size="small"
                                  title={record.complete === 1 ? "增量同步":"全量同步"}/>
                      <AuthButton auth={'DATA_CENTER$_METADATA$_ADD_METADATA'} type="normal" size="small"
                                  link={{to: 'task-history?taskDetailId=' + record.id, text: '日志'}}/>
                      <AuthButton text auth={'DATA_CENTER$_METADATA$_DELETE_METADATA'} type="normal"
                                  onClick={() => this.deleteEventTracking(record)} size="small"
                                  title={'删除'}/>
                      <AuthButton text auth={'DATA_CENTER$_METADATA$_DELETE_METADATA'} type="normal"
                                  onClick={() => this.changeStatus(record)} size="small"
                                  title={record.status === 1 ? "停用":"可用"}/>
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

export default TaskList;
