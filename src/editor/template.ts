export const template = `
<xml xmlns="https://developers.google.com/blockly/xml">
    <variables>
        <variable id="]Y{*%Fxe|)K|(2}sb.:7">algpunkt</variable>
        <variable id="/mc5YD*6TcY,H$(m,fBE">sihtpunkt</variable>
        <variable id="fixf:s~BAj3V#xIh@?C7">loendis</variable>
        <variable id="M2)aLTv3Sz3pw8v/?.$a">ristmik</variable>
        <variable id="h*51}YPa[U}@]4.INZ!Q">loendist</variable>
        <variable id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</variable>
        <variable id="bbB}|mrA0q51:KX%NAuy">teekond</variable>
        <variable id="]J8J+XtP_(7NQBawzX;M">naabrid</variable>
    </variables>
    <block type="procedures_defreturn" id="$9_L!E-5@|ihY_cycGke" x="338" y="-12">
        <mutation>
            <arg name="algpunkt" varid="]Y{*%Fxe|)K|(2}sb.:7"></arg>
            <arg name="sihtpunkt" varid="/mc5YD*6TcY,H$(m,fBE"></arg>
        </mutation>
        <field name="NAME">leia teekond</field>
        <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
        <statement name="STACK">
            <block type="variables_set" id="Fa}[@HBD^B)_*:oSp)1I">
                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                <value name="VALUE">
                    <block type="variables_get" id="l^7+ucxc?9v8,Dgd|sJY">
                        <field name="VAR" id="]Y{*%Fxe|)K|(2}sb.:7">algpunkt</field>
                    </block>
                </value>
                <next>
                    <block type="controls_whileUntil" id="?1e3vj*j.YJR)V:[VK6S">
                        <field name="MODE">UNTIL</field>
                        <value name="BOOL">
                            <block type="logic_compare" id="gkZM}X([9-d!R0ZI.Y?,">
                                <field name="OP">EQ</field>
                                <value name="A">
                                    <block type="variables_get" id="a[|Yr!|F6[0SA4m$YJ]5">
                                        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                                    </block>
                                </value>
                                <value name="B">
                                    <block type="variables_get" id="+QVVRC-ECD(Nvj/t[XB4">
                                        <field name="VAR" id="/mc5YD*6TcY,H$(m,fBE">sihtpunkt</field>
                                    </block>
                                </value>
                            </block>
                        </value>
                        <statement name="DO">
                            <block type="variables_set" id=":ru6w:#:#h=Xt7@2%!%^">
                                <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                                <value name="VALUE">
                                    <block type="procedures_callreturn" id="#RtIC8|]gYGnDD.tU~~q">
                                        <mutation name="leia naabrid">
                                            <arg name="ristmik"></arg>
                                        </mutation>
                                        <value name="ARG0">
                                            <block type="variables_get" id="yZFwsH]i~zh1HB:1JK^)">
                                                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                                            </block>
                                        </value>
                                    </block>
                                </value>
                                <next>
                                    <block type="controls_if" id="e;JWiZsA#MV:Y8B[gb]a">
                                        <mutation else="1"></mutation>
                                        <value name="IF0">
                                            <block type="procedures_callreturn" id="Q9%0,AW-:?hR]nr0Il_^">
                                                <mutation name="sisaldub">
                                                    <arg name="loendis"></arg>
                                                    <arg name="ristmik"></arg>
                                                </mutation>
                                                <value name="ARG0">
                                                    <block type="variables_get" id="88=*;D~s.th8@RJf_2-E">
                                                        <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                                                    </block>
                                                </value>
                                                <value name="ARG1">
                                                    <block type="variables_get" id="p-8*t1:.7[Pg{X!A,*]d">
                                                        <field name="VAR" id="/mc5YD*6TcY,H$(m,fBE">sihtpunkt</field>
                                                    </block>
                                                </value>
                                            </block>
                                        </value>
                                        <statement name="DO0">
                                            <block type="variables_set" id="aI]}**;nSgnfUm*a,,vx">
                                                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                                                <value name="VALUE">
                                                    <block type="variables_get" id="i5WU~3j1;9b|KLsr[E,)">
                                                        <field name="VAR" id="/mc5YD*6TcY,H$(m,fBE">sihtpunkt</field>
                                                    </block>
                                                </value>
                                            </block>
                                        </statement>
                                        <statement name="ELSE">
                                            <block type="variables_set" id="azUIcY|BD_^y^W4k~@*0">
                                                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                                                <value name="VALUE">
                                                    <block type="procedures_callreturn" id="Bx7NZ3GR0n$c)xSMy;HM">
                                                        <mutation name="vali juhuslik">
                                                            <arg name="loendist"></arg>
                                                        </mutation>
                                                        <value name="ARG0">
                                                            <block type="variables_get" id="LPkXl|.(^shjtRKB9Gt.">
                                                                <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                                                            </block>
                                                        </value>
                                                    </block>
                                                </value>
                                            </block>
                                        </statement>
                                    </block>
                                </next>
                            </block>
                        </statement>
                        <next>
                            <block type="lists_setIndex" id="LY.2{Mg8qeS;p-AXIU$l">
                                <mutation at="false"></mutation>
                                <field name="MODE">INSERT</field>
                                <field name="WHERE">LAST</field>
                                <value name="LIST">
                                    <block type="variables_get" id="U9Oli}@R:9dV6;oa_.HB">
                                        <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
                                    </block>
                                </value>
                                <value name="TO">
                                    <block type="variables_get" id="/b}D(3nGce|Q1xN6V[.U">
                                        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                                    </block>
                                </value>
                            </block>
                        </next>
                    </block>
                </next>
            </block>
        </statement>
        <value name="RETURN">
            <block type="variables_get" id="Tl-9lQp=Xcq_xJ3aasU)">
                <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
            </block>
        </value>
    </block>
    <block type="procedures_defreturn" id="()N^#+4jxg*VLO0$.OOR" x="1563" y="-12">
        <mutation>
            <arg name="loendis" varid="fixf:s~BAj3V#xIh@?C7"></arg>
            <arg name="ristmik" varid="M2)aLTv3Sz3pw8v/?.$a"></arg>
        </mutation>
        <field name="NAME">sisaldub</field>
        <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
        <value name="RETURN">
            <block type="logic_compare" id="k+[Vx|]Dhp2W^OBM/:*C">
                <field name="OP">NEQ</field>
                <value name="A">
                    <block type="lists_indexOf" id="YJ@-uo@r1b28n+7,T5ul">
                        <field name="END">FIRST</field>
                        <value name="VALUE">
                            <block type="variables_get" id="?:!}Rg6qv@%pg*fa:Jc5">
                                <field name="VAR" id="fixf:s~BAj3V#xIh@?C7">loendis</field>
                            </block>
                        </value>
                        <value name="FIND">
                            <block type="variables_get" id=".mRQ6bF6HK8jZ}#/pNU/">
                                <field name="VAR" id="M2)aLTv3Sz3pw8v/?.$a">ristmik</field>
                            </block>
                        </value>
                    </block>
                </value>
                <value name="B">
                    <block type="math_number" id="Lb3Ul3yytT+v0:-i+tWg">
                        <field name="NUM">0</field>
                    </block>
                </value>
            </block>
        </value>
    </block>
    <block type="procedures_defreturn" id="%Ob/,khk(@0.6WmVvK_$" x="1563" y="88">
        <mutation>
            <arg name="ristmik" varid="M2)aLTv3Sz3pw8v/?.$a"></arg>
        </mutation>
        <field name="NAME">leia naabrid</field>
        <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
    </block>
    <block type="procedures_defreturn" id="9IZUelqRztKf,7e70eJ4" x="1563" y="213">
        <mutation>
            <arg name="loendist" varid="h*51}YPa[U}@]4.INZ!Q"></arg>
        </mutation>
        <field name="NAME">vali juhuslik</field>
        <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
        <value name="RETURN">
            <block type="lists_getIndex" id=")z-oM!7X#nrWeW^OjN+p">
                <mutation statement="false" at="true"></mutation>
                <field name="MODE">GET</field>
                <field name="WHERE">FROM_START</field>
                <value name="VALUE">
                    <block type="variables_get" id="I^t%M[dySBNdWjv@Yok/">
                        <field name="VAR" id="h*51}YPa[U}@]4.INZ!Q">loendist</field>
                    </block>
                </value>
                <value name="AT">
                    <block type="math_random_int" id=")VFw8Uo9;qDWyee3+bEA">
                        <value name="FROM">
                            <shadow type="math_number" id="Y8mXgE}O2]pW(g0_M+-Q">
                                <field name="NUM">1</field>
                            </shadow>
                        </value>
                        <value name="TO">
                            <shadow type="math_number" id=",wXl*h2US;K0[_8Ke:%W">
                                <field name="NUM">100</field>
                            </shadow>
                            <block type="lists_length" id="o2a!eebMa++Lh/lnuyW?">
                                <value name="VALUE">
                                    <block type="variables_get" id="kVTpOBH=s$w1msC6+u.u">
                                        <field name="VAR" id="h*51}YPa[U}@]4.INZ!Q">loendist</field>
                                    </block>
                                </value>
                            </block>
                        </value>
                    </block>
                </value>
            </block>
        </value>
    </block>
</xml>
`