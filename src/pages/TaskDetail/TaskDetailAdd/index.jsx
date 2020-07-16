/**
 * @description: 数据中台-任务-任务管理-新建任务
 * @author: hj
 * @update: hj(2020-01-14)
 */
import React from 'react';
import IceContainer from '@icedesign/container';
import {Button, Dialog, Form, Grid, Input, Message, Pagination, Select, Table} from '@alifd/next';
import styles from './index.module.scss';
import url from '@/request'
import $http from '@/service/Services';
import AuthButton from '@/components/AuthComponent/AuthBotton';

const axios = $http;
const formItemLayout = {
  labelCol: {
    fixedSpan: 4
  },
  wrapperCol: {
    span: 16
  }
};
const FormItem = Form.Item;
const Option = Select.Option;
const {Row, Col} = Grid;
let form;


/**
 * list
 */
class TaskEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      id: '',
      buyFreeInfo: {},
      datasources: [],
      taskList: [],
      datasourceTypeId: '',
      schames: [],
      taskDetailList: [],
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    };
    // 当前页数
    this.pageNum = 1;
    // 分页每页显示数据条数
    this.pageSize = 10;
    // 数据总条数
    this.totalNum = 0;
    this.formChange = this.formChange.bind(this);
    this.validateAllFormField = this.validateAllFormField.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  /**
   * 在渲染前调用,在客户端也在服务端
   */
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get('id');
    this.setState({
      id: id,
    }, () => {
      this.getAllDatasourceList();
      if (id) {
        const that = this;
        axios.get(url.url + '/v1/taskDetail/getTTaskDetailById/' + id)
          .then(function (response) {
            const {data} = response;
            if (data.code === 1) {
              Message.warning(data.message ? data.message : data.data);
            } else {
              that.setState({
                value: data.data,
                checkedFreeTableList: data.data.tableNames
              })
            }
          })
          .catch(function (error) {
            Message.error(error.message);
          })
      }
    });
  };

  /**
   * 获取所有数据源列表
   */
  getAllDatasourceList = () => {
    const that = this;
    axios.get(url.url + '/v1/tDataSource/getAllDatasourceList').then(function (response) {
      const {data} = response;
      if (data.code === 1) {
        Message.warning(data.message ? data.message : data.data);
      } else {
        that.setState({
          datasources: data.data
        })
      }
    })
      .catch(function (error) {
        Message.error(error.message);
      });
  };
  /**
   * 获取一级，二级菜单接口
   */
  getAllTableList = (pageNum) => {
    const that = this;
    const {value} = this.state;
    that.pageNum = typeof (pageNum) == 'number' ? pageNum : that.pageNum;
    axios.get(url.url + '/v1/tDataSource/getDatabaseBySourceId/' + that.pageSize + '/' + that.pageNum + '/' + value.datasourceId)
      .then(function (response) {
        const {data} = response;
        if (data.code === 1) {
          Message.warning(data.message ? data.message : data.data);
        } else {
          const arr = data.data.voList;
          that.totalNum = data.data.total;
          that.setState({
            TableList: arr
          })
        }
      })
      .catch(function (error) {
        console.error(error);
        Message.error(error.message);
      })
  };

  /* 表改变
  * @param formValue
  */
  formChange = (formValue) => {
    this.setState({
      value: formValue
    })
  };
  /**
   * 表验证
   */
  validateAllFormField = () => {
    const {value, checkedFreeTableList} = this.state;

    try {
      if (checkedFreeTableList.length = 0) {
        Message.warning('请填写必要的数据.');
        return;
      }
      value["tableNames"] = checkedFreeTableList;
      const that = this;
      axios.post(url.url + '/v1/taskDetail/saveOrUpdateTaskDetail', value)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            Message.success('操作成功.');
            that.props.history.go(-1);
          }
        })
        .catch(function (error) {
          console.error(error);
          Message.error(error.message);
        })
    } catch (e) {
      console.error(e);
    }
  };

  /**
   *
   * @param keys
   * @param info
   */
  handleCheck(keys, info) {
    this.setState({
      checkedKeys: keys,
      info: info
    });
  }

  /**
   * 获取门店数据
   * @param pageNum
   */
  getTableList = (pageNum) => {
    this.getAllTableList(pageNum);
  }

  /**
   * 打开添加门店的弹窗
   */
  openAddTableDialog = () => {
    const {value} = this.state;
    if (value.datasourceId == undefined || value.datasourceId === '' || value.datasourceId == null) {
      Message.warning('请先来源数据库...');
      return;
    }
    this.getTableList(1);
    let arr = [];
    this.setState({
      checkedFreeTableIdList: [],
      checkedFreeTableList: [],
      addFreeTableDialogVisible: true,
      checkedTableIdList: arr
    })
  };

  /**
   * 移除主数据表确定
   */
  okBuyTableCall = (index, record) => {
    let {checkedFreeTableList} = this.state;
    checkedFreeTableList.splice(index, 1)
    this.setState({
      checkedFreeTableList: checkedFreeTableList,
    })
  };


  /**
   * 关闭赠送数据表的弹窗
   */
  onFreeTableClose = () => {
    this.setState({
      addFreeTableDialogVisible: false
    })
  }


  /**
   * 赠送数据表确定事件
   */
  onFreeTableOk = () => {
    const {checkedFreeTableList, checkedFreeTableIdList} = this.state;
    this.setState({
      addFreeTableDialogVisible: false,
      checkedFreeTableIdList: checkedFreeTableIdList
    })

  };

  /**
   * 数据表分页
   * @param currentPage
   */
  onTableChangePage = (currentPage) => {
    this.getTableList(currentPage);
  };


  /**
   * 选中赠送数据表事件
   * @param value
   * @param data
   * @param extra
   */
  freeTableChange = (value, data, extra) => {
    this.setState({
      checkedFreeTableIdList: value,
      checkedFreeTableList: data
    })
  }

  /**
   * 表
   * @returns {*}
   */
  render() {
    const {buyFreeInfo, checkedFreeTableList} = this.state;
    return (
      <div>
        <div className='container-header'>
          <p style={{display: 'inline-block'}}>新建任务</p>
          <Button type="normal" size="small" className='next-btn-normal table-btn-return' style={{float: 'right'}}>
            <a onClick={() => {
              this.props.history.go(-1)
            }}> 返回</a>
          </Button>
        </div>
        <IceContainer className='container-main'>
          <Form className='phdj-from classify-form'
                value={this.state.value}
                onChange={this.formChange}
                ref={formRef => form = formRef}>
            <p className='form-title'>活动设置</p>
            <FormItem labelAlign='top' label="任务名称：" required
                      requiredMessage="请填写任务名称">
              <Input name="name" className={styles.inputNme} placeholder="请填写活动名称" style={{width: 400}}
                     aria-required="true"/>
            </FormItem>
            <FormItem labelAlign='top' label="来源数据库：" required
                      requiredMessage="请填写任务名称">
              <Select name={'datasourceId'}
                      placeholder="请选择"
                      className={styles.inputNme}
              >
                {
                  this.state.datasources.map(
                    o => {
                      return (<Option value={o.id}>{o.name}</Option>)
                    }
                  )
                }
              </Select>
            </FormItem>
            <FormItem labelAlign='top' label="目标数据源：" required
                      requiredMessage="请填写任务名称">
              <Select name={'targetId'}
                      placeholder="请选择"
                      className={styles.inputNme}
              >
                {
                  this.state.datasources.map(
                    o => {
                      return (<Option value={o.id}>{o.name}</Option>)
                    }
                  )
                }
              </Select>
            </FormItem>
            <FormItem labelAlign='top' label="任务描述：">
              <Input.TextArea
                maxLength={50}
                rows={8} style={{width: '400px'}} name={'content'}
                hasLimitHint
                placeholder="请填写任务描述信息"
                className={styles.inputNme}
              />
            </FormItem>
            <p className='form-title'>数据表列表</p>
            <FormItem {...formItemLayout} label="选择数据表：" required>
              <AuthButton auth={''}
                          type="primary"
                          title={'添加数据表'}
                          onClick={this.openAddTableDialog}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="数据表列表：" required>
              <Table dataSource={checkedFreeTableList} hideOnlyOnePage primaryKey="id" size="small" fixedHeader
                     maxBodyHeight={400}>
                <Table.Column align="center" title="数据表" dataIndex="name"/>
                <Table.Column align="center" title="增量识别字段" dataIndex="incrementColumn"/>
                <Table.Column align="center" title="操作" cell={
                  (value, index, record) => {
                    return (
                      <div>
                        <AuthButton auth={''}
                                    type="primary"
                                    onClick={this.okBuyTableCall.bind(this, index, record)}
                                    title={'删除'}/>
                      </div>
                    )
                  }
                }/>
              </Table>
            </FormItem>
            <Row>
              <Col style={{textAlign: 'left', marginTop: '20px'}}>
                <Form.Submit className='phdj-btn-submit' type="primary" validate onClick={this.validateAllFormField}
                             style={{marginRight: '5px'}}>提交</Form.Submit>
              </Col>
            </Row>
            <Dialog
              title="添加数据表"
              className={styles.addTableStyle}
              visible={this.state.addFreeTableDialogVisible}
              isFullScreen={true}
              onOk={this.onFreeTableOk}
              onCancel={this.onFreeTableClose}
              onClose={this.onFreeTableClose}
            >
              <Form
                ref={formRef => form = formRef}
              >
              </Form>
              <Table dataSource={this.state.TableList} hideOnlyOnePage primaryKey="id" size="small"
                     rowSelection={{
                       onChange: this.freeTableChange,
                       selectedRowKeys: this.state.checkedFreeTableIdList
                     }}
              >
                <Table.Column align="center" width={"120"} title="表名" dataIndex="comment"/>
                <Table.Column align="center" title="数据表" dataIndex="name"/>
                <Table.Column align="center" width={"120"} title="增量识别字段" dataIndex="incrementColumn"/>
              </Table>
              <Pagination defaultCurrent={1}
                          current={this.pageNum}
                          pageSize={this.pageSize}
                          total={this.totalNum}
                          onChange={this.onTableChangePage}
                          hideOnlyOnePage
                          className="page-demo"
                          size="small"
              />
            </Dialog>
          </Form>
        </IceContainer>
      </div>
    );
  }

}

export default TaskEdit;
