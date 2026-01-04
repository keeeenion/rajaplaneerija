export const template = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="]Y{*%Fxe|)K|(2}sb.:7">algpunkt</variable>
    <variable id="/mc5YD*6TcY,H$(m,fBE">sihtpunkt</variable>
    <variable id="fixf:s~BAj3V#xIh@?C7">loendis</variable>
    <variable id="M2)aLTv3Sz3pw8v/?.$a">ristmik</variable>
    <variable id="h*51}YPa[U}@]4.INZ!Q">loendist</variable>
    <variable id="bbB}|mrA0q51:KX%NAuy">teekond</variable>
    <variable id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</variable>
    <variable id="]J8J+XtP_(7NQBawzX;M">naabrid</variable>
  </variables>
  <block type="procedures_defreturn" id="sB3DAe@{K~dDeNXvpS_}" x="338" y="-12">
    <mutation>
      <arg name="algpunkt" varid="]Y{*%Fxe|)K|(2}sb.:7"></arg>
      <arg name="sihtpunkt" varid="/mc5YD*6TcY,H$(m,fBE"></arg>
    </mutation>
    <field name="NAME">leia teekond</field>
    <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
    <statement name="STACK">
      <block type="variables_set" id="tQ6D}~A5to-6k]sMmKMl">
        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
        <value name="VALUE">
          <block type="start_intersection" id="cq!o#tet)^u?1q3w-QH."></block>
        </value>
        <next>
          <block type="variables_set" id="UZkQF;lm-cHR2yobe,I]">
            <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
            <value name="VALUE">
              <block type="lists_repeat" id="@mC;.s:v,B|ryHeJu,x]">
                <value name="NUM">
                  <shadow type="math_number" id="?bl,Euqb+a09kDJ6tJZ=">
                    <field name="NUM">0</field>
                  </shadow>
                </value>
              </block>
            </value>
            <next>
              <block type="controls_whileUntil" id="?58R18R~RfAK{A8.~6Qc">
                <field name="MODE">UNTIL</field>
                <value name="BOOL">
                  <block type="logic_compare" id="1ULD3Pk~SKM3*N??;WZX">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get" id="Sgk2HN0Yw[jFn{R:%}c5">
                        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="target_intersection" id="{VgUiHX5F%GTDzS{[]4:"></block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="variables_set" id="0h=Lub@BF]N0Y1if6^8f">
                    <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                    <value name="VALUE">
                      <block type="intersection_neighbors" id="p}W](y](Os*,M31O[+d7">
                        <value name="NODE">
                          <block type="variables_get" id=",9{BiiC7duZZXx.Dw6,N">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="controls_if" id="iT9aI58*u6$pPit,T[_e">
                        <mutation else="1"></mutation>
                        <value name="IF0">
                          <block type="procedures_callreturn" id="J(y:@(WCP~Ww;ej,IS)f">
                            <mutation name="sisaldub">
                              <arg name="loendis"></arg>
                              <arg name="ristmik"></arg>
                            </mutation>
                            <value name="ARG0">
                              <block type="variables_get" id="nnyBBJnjhdotv;@Wij|3">
                                <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                              </block>
                            </value>
                            <value name="ARG1">
                              <block type="target_intersection" id="30PQS{8rWqo|Sv3uB?w|"></block>
                            </value>
                          </block>
                        </value>
                        <statement name="DO0">
                          <block type="variables_set" id="w;l!-5SJyuO82Li9doQA">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                            <value name="VALUE">
                              <block type="target_intersection" id="L4!2PISU(SK2IBvI,%Rz"></block>
                            </value>
                          </block>
                        </statement>
                        <statement name="ELSE">
                          <block type="variables_set" id="LyL=0Vq~Y5,OKR=x0z,-">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                            <value name="VALUE">
                              <block type="procedures_callreturn" id=")Bt|-Lo88CUO4OjSA=_I">
                                <mutation name="vali juhuslik">
                                  <arg name="loendist"></arg>
                                </mutation>
                                <value name="ARG0">
                                  <block type="variables_get" id="7*rthB8UBFcW@+ockeDP">
                                    <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </statement>
                        <next>
                          <block type="lists_setIndex" id="1=6Tr(|1F^VVfI!76F!Q">
                            <mutation at="false"></mutation>
                            <field name="MODE">INSERT</field>
                            <field name="WHERE">LAST</field>
                            <value name="LIST">
                              <block type="variables_get" id="UT%~H-vF.3^VrZ,G6_bq">
                                <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
                              </block>
                            </value>
                            <value name="TO">
                              <block type="variables_get" id="(0TZ9KT$apv,z9uPa..}">
                                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
    <value name="RETURN">
      <block type="variables_get" id="R^oLA|pg##GE}E#.sfwD">
        <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
      </block>
    </value>
  </block>
  <block type="procedures_defreturn" id="wKglx-!-V:Bw*[BOLpa(" x="1563" y="-12">
    <mutation>
      <arg name="loendis" varid="fixf:s~BAj3V#xIh@?C7"></arg>
      <arg name="ristmik" varid="M2)aLTv3Sz3pw8v/?.$a"></arg>
    </mutation>
    <field name="NAME">sisaldub</field>
    <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
    <value name="RETURN">
      <block type="logic_compare" id="^6(!KIOCgYYx#)3)=~_@">
        <field name="OP">NEQ</field>
        <value name="A">
          <block type="lists_indexOf" id="J|eX[MT~w{P0RvNfVgxE">
            <field name="END">FIRST</field>
            <value name="VALUE">
              <block type="variables_get" id="O:h%e%mtES^JWK+YmH%6">
                <field name="VAR" id="fixf:s~BAj3V#xIh@?C7">loendis</field>
              </block>
            </value>
            <value name="FIND">
              <block type="variables_get" id="$Ka,iAn(blsEPPn1[=P2">
                <field name="VAR" id="M2)aLTv3Sz3pw8v/?.$a">ristmik</field>
              </block>
            </value>
          </block>
        </value>
        <value name="B">
          <block type="math_number" id="TFD*?sEuikZKx7qoM8r_">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </value>
  </block>
  <block type="procedures_defreturn" id="PX*?TU)8kyfSzTtz[$!1" x="1563" y="88">
    <mutation>
      <arg name="ristmik" varid="M2)aLTv3Sz3pw8v/?.$a"></arg>
    </mutation>
    <field name="NAME">leia naabrid</field>
    <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
  </block>
  <block type="procedures_defreturn" id="afb-%!*x8|f~;rIN~ht[" x="1563" y="213">
    <mutation>
      <arg name="loendist" varid="h*51}YPa[U}@]4.INZ!Q"></arg>
    </mutation>
    <field name="NAME">vali juhuslik</field>
    <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
    <value name="RETURN">
      <block type="lists_getIndex" id="[Xj[GsV,XRog2v.x.CG+">
        <mutation statement="false" at="true"></mutation>
        <field name="MODE">GET</field>
        <field name="WHERE">FROM_START</field>
        <value name="VALUE">
          <block type="variables_get" id="EDZCV9OOaKHk#[N}{raV">
            <field name="VAR" id="h*51}YPa[U}@]4.INZ!Q">loendist</field>
          </block>
        </value>
        <value name="AT">
          <block type="math_random_int" id="d-1e;swu_b:hqxcxoH77">
            <value name="FROM">
              <shadow type="math_number" id="nn~qvUKd/6e7,FOMc,DA">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <value name="TO">
              <shadow type="math_number" id="Dmn!%!mn1tCN[0SUyVp2">
                <field name="NUM">100</field>
              </shadow>
              <block type="lists_length" id="^L*.Lx.UXchK{=hSIt+v">
                <value name="VALUE">
                  <block type="variables_get" id="y4w[Lp}e,Hfu5N.oK.Ju">
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