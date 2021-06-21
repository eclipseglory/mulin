import utils from '../utils.js';

const NW_INDEX = 0;
const NE_INDEX = 1;
const SW_INDEX = 2;
const SE_INDEX = 3;

export default class QuadTreeNode {
    constructor(bounds = { left: 0, top: 0, right: 0, bottom: 0 },
        maxNodes = 5, currentDeepth = 0, maxDeepth = 5) {
        if (bounds == null) throw 'QuadTree Bounds can not be null'
        this.totalNodesCount = 0;
        this.bounds = bounds;
        this.maxNodes = maxNodes;
        this.currentDeepth = currentDeepth;
        this.maxDeepth = maxDeepth;
        this.nodes = [];
        this.areas = Array(4);
        this.parent;
    }

    findNodes(bounds) {
        if (QuadTreeNode.isContacted(bounds, this.bounds)) {
            if (this.nodes.length == 0) {
                let nodes = [];
                for (let i = this.areas.length - 1; i >= 0; i--) {
                    let area = this.areas[i];
                    if (area) {
                        let r = area.findNodes(bounds);
                        if (r != null) {
                            r.forEach((n) => {
                                if (nodes.indexOf(n) == -1)
                                    nodes.push(n)
                            });
                        }
                    }
                }
                return nodes;
            } else {
                return this.nodes;
            }
        } else {
            return null;
        }
    }

    findSingleNode(x, y) {
        if (QuadTreeNode.containsPoint(x, y, this.bounds)) {
            if (this.nodes.length == 0) {
                for (let i = this.areas.length - 1; i >= 0; i--) {
                    let area = this.areas[i];
                    if (area) {
                        let r = area.findSingleNode(x, y);
                        if (r != null) return r;
                    }
                }
                return null;
            } else {
                for (let i = this.nodes.length - 1; i >= 0; i--) {
                    let node = this.nodes[i];
                    if (QuadTreeNode.containsPoint(x, y, node.bounds)) {
                        return node;
                    }
                }
                return null;
            }
        } else {
            return null;
        }
    }

    _getArea(index) {
        return this.areas[index];
    }

    splitInsert(node) {
        let l = this.bounds.left;
        let r = this.bounds.right;
        let t = this.bounds.top;
        let b = this.bounds.bottom;
        let cx = Math.floor((r + l) / 2);
        let cy = Math.floor((b + t) / 2);

        let nw = this.areas[NW_INDEX];
        if (!nw) {
            nw = new QuadTreeNode({ left: l, top: t, right: cx, bottom: cy },
                this.maxNodes, this.currentDeepth + 1, this.maxDeepth);
            this.areas[NW_INDEX] = nw;
        }
        nw.insert(node);

        let ne = this.areas[NE_INDEX];
        if (!ne) {
            ne = new QuadTreeNode({ left: cx, top: t, right: r, bottom: cy },
                this.maxNodes, this.currentDeepth + 1, this.maxDeepth);
            this.areas[NE_INDEX] = ne;
        }
        ne.insert(node);

        let sw = this.areas[SW_INDEX];
        if (!sw) {
            sw = new QuadTreeNode({ left: l, top: cy, right: cx, bottom: b },
                this.maxNodes, this.currentDeepth + 1, this.maxDeepth);
            this.areas[SW_INDEX] = sw;
        }
        sw.insert(node);

        let se = this.areas[SE_INDEX];
        if (!se) {
            se = new QuadTreeNode({ left: cx, top: cy, right: r, bottom: b },
                this.maxNodes, this.currentDeepth + 1, this.maxDeepth);
            this.areas[SE_INDEX] = se;
        }
        se.insert(node);
    }

    _createRelationShip(node, relation) {
        if (!node.__related_quad)
            node.__related_quad = [];
        if (node.__related_quad.indexOf(relation) == -1)
            node.__related_quad.push(relation);
    }

    _deleteRelationShip(node, relation) {
        if (node.__related_quad) {
            let index = node.__related_quad.indexOf(relation);
            if (index != -1) {
                node.__related_quad.splice(index, 1);
            }
        }
    }

    insert(node) {
        if (QuadTreeNode.isContacted(node.bounds, this.bounds)) {
            if (this.totalNodesCount >= this.maxNodes) {
                this.totalNodesCount++;
                if (this.currentDeepth == this.maxDeepth) {
                    this.nodes.push(node);
                    this._createRelationShip(node, this);
                    return true;
                } else {
                    this.nodes.forEach((n) => {
                        this._deleteRelationShip(n, this);
                        this.splitInsert(n);
                    });
                    this.splitInsert(node);
                    this._deleteRelationShip(node, this);
                    this.nodes.length = 0;
                    return true;
                }
            } else {
                this.totalNodesCount++;
                this.nodes.push(node);
                this._createRelationShip(node, this);
                return true;
            }
        } else {
            return false;
        }
    }

    merge() {
        this.areas.forEach((area) => {
            if (area) {
                area.nodes.forEach((n) => {
                    this.nodes.push(n);
                })
                area.nodes.length = 0;
            }
        })
        for (let i = 0; i < this.areas.length; i++) {
            this.areas[i] = null;
        }
    }

    static deleteNodeForce(node) {
        if (!node) return;
        let relateds = node.__related_quad;
        if (relateds == null) {
            return;
        }
        let decreased = {};
        let needMerge = {};
        relateds.forEach((relate) => {
            let index = relate.nodes.indexOf(node);
            if (index != -1) {
                relate.nodes.splice(index, 1);
                relate.decreaseTotalNodes(decreased, needMerge);
            }
        });
        relateds.length = 0;
    }

    decreaseTotalNodes(decreased = {}, needMerge = {}) {
        if (decreased[this]) return;
        decreased[this] = true;
        this.totalNodesCount--;
        if (this.totalNodesCount < this.maxNodes) {
            needMerge[this] = true;
        }
        if (this.parent) {
            this.parent.decreaseTotalNodes(decreased, needMerge);
        }
    }

    remove(node) {
        if (QuadTreeNode.isContacted(node.bounds, this.bounds)) {
            if (this.nodes.length != 0) {
                let index = this.nodes.indexOf(node);
                if (index == -1) return false;
                this.nodes.splice(index, 1);
                this.totalNodesCount--;
                return true;
            } else {
                let nw = this.areas[0];
                let dr = false;
                if (!nw) {
                    dr |= nw.remove(node);
                }

                let ne = this.areas[1];
                if (!ne) {
                    dr |= ne.remove(node);
                }

                let sw = this.areas[2];
                if (!sw) {
                    dr |= sw.remove(node);
                }

                let se = this.areas[3];
                if (!se) {
                    dr |= se.remove(node);
                }
                if (dr) {
                    this.totalNodesCount--;
                    if (this.totalNodesCount < this.maxNodes) {
                        this.merge();
                    }
                } else {
                    console.warn('这里发生了buuuugggg');
                }
                return dr;
            }
        } else {
            return false;
        }
    }

    dispose() {
        this.nodes.length = 0;
        this.nodes = null;
        this.areas.forEach((a) => {
            if (a) a.dispose();
        })
        this.areas = null;
    }

    static containsPoint(x, y, bounds) {
        return utils.containsPoint(x, y, bounds);
    }

    static isContacted(rect1, rect2) {
        return utils.isContacted(rect1, rect2);
    }
}